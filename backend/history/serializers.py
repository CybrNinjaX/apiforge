from rest_framework import serializers

from .models import RequestHistory


class RequestHistorySerializer(serializers.ModelSerializer):
	class Meta:
		model = RequestHistory
		fields = (
			'id', 'method', 'url', 'request_headers', 'request_body', 'response_status',
			'response_headers', 'response_body', 'duration_ms', 'executed_at',
		)
		read_only_fields = ('id', 'executed_at')
