from django.urls import path

from .views import RequestHistoryListCreateView

urlpatterns = [path('', RequestHistoryListCreateView.as_view(), name='request_history')]
