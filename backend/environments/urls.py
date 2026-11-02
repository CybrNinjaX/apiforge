from django.urls import path

from .views import EnvironmentDetailView, EnvironmentListCreateView

urlpatterns = [
	path('', EnvironmentListCreateView.as_view(), name='environment_list'),
	path('<int:pk>/', EnvironmentDetailView.as_view(), name='environment_detail'),
]
