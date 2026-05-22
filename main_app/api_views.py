from rest_framework import viewsets, permissions
from .models import Report
from .serializers import ReportSerializer
from .permissions import IsOwnerAndDraftOrReadOnly, IsCitizenCanCreate


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_admin:
            return Report.objects.exclude(status='DRAFT').order_by('-created_at')

        if user.is_member:
            return Report.objects.filter(
                reporter=user
            ) | Report.objects.exclude(status='DRAFT')

        return Report.objects.none()

    def get_permissions(self):
        if self.action == 'create':
            return [IsCitizenCanCreate()]

        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerAndDraftOrReadOnly()]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)