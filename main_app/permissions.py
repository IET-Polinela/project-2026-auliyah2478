from rest_framework import permissions


class IsOwnerAndDraftOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.reporter == request.user and obj.status == 'DRAFT'


class IsCitizenCanCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_member