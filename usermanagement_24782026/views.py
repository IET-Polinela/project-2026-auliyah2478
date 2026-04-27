from django.views.generic import CreateView
from django.urls import reverse_lazy
from .forms import RegisterForm
from django.contrib import messages
from django.shortcuts import redirect

class RegisterView(CreateView):
    form_class = RegisterForm
    template_name = 'registration/register.html'
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        user = form.save(commit=False)
        user.is_admin = False
        user.is_member = True
        user.save()

        messages.success(self.request, "Registrasi berhasil, silakan login")
        return redirect(self.success_url)