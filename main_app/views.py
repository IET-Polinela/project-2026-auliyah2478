from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Report
from django.views import View
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from django.views.generic import TemplateView
from django.http import JsonResponse
from django.db.models import Q


class HomeView(TemplateView):
    template_name = 'main_app/home.html'


# READ (List)
class ReportListView(ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'


# DETAIL
class ReportDetailView(DetailView):
    model = Report
    template_name = 'main_app/report_detail.html'


# CREATE
class ReportCreateView(CreateView):
    model = Report
    fields = ['title', 'category', 'description', 'location']
    template_name = 'main_app/add_report.html'
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin:
            messages.error(request, "Akses ditolak")
            return redirect('report_list')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil ditambahkan")
        return super().form_valid(form)


# UPDATE
class ReportUpdateView(UpdateView):
    model = Report
    fields = ['title', 'category', 'description', 'location']
    template_name = 'main_app/update_report.html'
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin:
            messages.error(request, "Akses ditolak")
            return redirect('report_list')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil diupdate")
        return super().form_valid(form)


# DELETE
class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    success_url = reverse_lazy('report_list')

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin:
            messages.error(request, "Akses ditolak")
            return redirect('report_list')
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil dihapus")
        return super().form_valid(form)


# UPDATE STATUS
class ReportUpdateStatusView(View):

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin:
            messages.error(request, "Akses ditolak")
            return redirect('report_list')
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        new_status = request.GET.get('status')

        return render(request, 'main_app/delete_report.html', {
            'object': report,
            'mode': 'status',
            'new_status': new_status
        })

    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        new_status = request.POST.get('status')

        valid_transitions = {
            'REPORTED': 'VERIFIED',
            'VERIFIED': 'IN_PROGRESS',
            'IN_PROGRESS': 'RESOLVED',
        }

        if valid_transitions.get(report.status) == new_status:
            report.status = new_status
            report.save()
            messages.success(request, "Status berhasil diubah")
        else:
            messages.error(request, "Perubahan status tidak valid")

        return redirect('report_list')


# VIEW: Live Search laporan (AJAX / Fetch API)
def report_search(request):
    keyword = request.GET.get('q', '')

    reports = Report.objects.filter(
        Q(title__icontains=keyword) |
        Q(category__icontains=keyword) |
        Q(location__icontains=keyword) |
        Q(status__icontains=keyword)
    ).order_by('-created_at')

    data = []

    for report in reports:
        data.append({
            'id': report.id,
            'title': report.title,
            'category': report.category,
            'location': report.location,
            'status': report.status,
        })

    return JsonResponse({'reports': data})


# VIEW: Detail laporan untuk modal (AJAX / Fetch API)
def report_detail_json(request, pk):
    report = get_object_or_404(Report, pk=pk)

    data = {
        'id': report.id,
        'title': report.title,
        'category': report.category,
        'description': report.description,
        'location': report.location,
        'status': report.status,
        'created_at': report.created_at.strftime('%d %B %Y %H:%M'),
    }

    return JsonResponse(data)