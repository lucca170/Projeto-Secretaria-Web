# escola/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Endpoints de Autenticação da API
    path('api/auth/', include('dj_rest_auth.urls')),

    # Incluindo as URLs da sua app `base`
    path('', include('escola.base.urls')),
    
    # Incluindo TODAS as URLs da app `pedagogico`
   path('api/pedagogico/', include('escola.pedagogico.urls')),
    
    # Incluindo outras apps (exemplo)
    path('disciplinar/', include('escola.disciplinar.urls')),
    path('financeiro/', include('escola.financeiro.urls')),
]