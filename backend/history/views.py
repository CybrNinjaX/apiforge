from rest_framework.generics import ListCreateAPIView

from .models import RequestHistory
from .serializers import RequestHistorySerializer


class RequestHistoryListCreateView(ListCreateAPIView):
	serializer_class = RequestHistorySerializer

	def get_queryset(self):
		return RequestHistory.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
