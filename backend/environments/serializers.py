from rest_framework import serializers

from .models import Environment


class EnvironmentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Environment
		fields = ('id', 'name', 'variables', 'is_active', 'created_at', 'updated_at')
		read_only_fields = ('id', 'created_at', 'updated_at')
