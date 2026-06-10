from django.views.generic import TemplateView
from django.http import JsonResponse
from django.db.models import Count
from main_app.models import Report


class DashboardView(TemplateView):
    template_name = 'dashboard_24782026/dashboard.html'


def dashboard_data(request):
    status_data = Report.objects.values('status').annotate(total=Count('id'))
    category_data = Report.objects.values('category').annotate(total=Count('id'))

    latest_reported = Report.objects.filter(status='REPORTED').order_by('-created_at')[:5]
    latest_resolved = Report.objects.filter(status='RESOLVED').order_by('-created_at')[:5]

    return JsonResponse({
        'status_data': list(status_data),
        'category_data': list(category_data),
        'latest_reported': list(latest_reported.values(
            'id', 'title', 'category', 'location', 'status', 'created_at'
        )),
        'latest_resolved': list(latest_resolved.values(
            'id', 'title', 'category', 'location', 'status', 'created_at'
        )),
    })