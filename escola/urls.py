from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('', include('escola.base.urls')), 
    
    path('pedagogico/', include('escola.pedagogico.urls')),
    path('financeiro/', include('escola.financeiro.urls')),
    path('coordenacao/', include('escola.coordenacao.urls')),
    path('api-token-auth/', views.obtain_auth_token, name='api-token-auth'),
]