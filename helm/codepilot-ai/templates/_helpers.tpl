{{/*
CodePilot AI — Helm Template Helpers
*/}}

{{/* Expand the name of the chart */}}
{{- define "codepilot-ai.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/* Create a default fully qualified app name */}}
{{- define "codepilot-ai.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/* Create chart label */}}
{{- define "codepilot-ai.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/* Common labels */}}
{{- define "codepilot-ai.labels" -}}
helm.sh/chart: {{ include "codepilot-ai.chart" . }}
{{ include "codepilot-ai.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/* Selector labels */}}
{{- define "codepilot-ai.selectorLabels" -}}
app.kubernetes.io/name: {{ include "codepilot-ai.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/* Service account name */}}
{{- define "codepilot-ai.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "codepilot-ai.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/* PostgreSQL connection URL */}}
{{- define "codepilot-ai.databaseUrl" -}}
{{- printf "postgresql://%s:%s@%s-postgresql:5432/%s" .Values.postgresql.auth.username .Values.postgresql.auth.password (include "codepilot-ai.fullname" .) .Values.postgresql.auth.database }}
{{- end }}

{{/* Redis connection URL */}}
{{- define "codepilot-ai.redisUrl" -}}
{{- printf "redis://%s-redis-master:6379/0" (include "codepilot-ai.fullname" .) }}
{{- end }}

{{/* MinIO endpoint URL */}}
{{- define "codepilot-ai.minioUrl" -}}
{{- printf "http://%s-minio:9000" (include "codepilot-ai.fullname" .) }}
{{- end }}
