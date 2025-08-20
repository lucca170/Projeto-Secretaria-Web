from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('pedagogico/', include('escola.pedagogico.urls')),
    path('financeiro/', include('escola.financeiro.urls')),
    path('coordenacao/', include('escola.coordenacao.urls')),
]