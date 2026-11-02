from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from api_collections.views import personal_workspace
from .models import Environment
from .serializers import EnvironmentSerializer


class EnvironmentListCreateView(ListCreateAPIView):
	serializer_class = EnvironmentSerializer

	def get_queryset(self):
		return Environment.objects.filter(workspace__owner=self.request.user)

	def perform_create(self, serializer):
		workspace = personal_workspace(self.request.user)
		if serializer.validated_data.get('is_active'):
			Environment.objects.filter(workspace=workspace).update(is_active=False)
		serializer.save(workspace=workspace)

	def perform_update(self, serializer):
		if serializer.validated_data.get('is_active'):
			Environment.objects.filter(workspace=self.get_object().workspace).update(is_active=False)
		serializer.save()


class EnvironmentDetailView(RetrieveUpdateDestroyAPIView):
	serializer_class = EnvironmentSerializer

	def get_queryset(self):
		return Environment.objects.filter(workspace__owner=self.request.user)
