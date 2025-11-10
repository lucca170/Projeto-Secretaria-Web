from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('escola.base.urls')),
    path('pedagogico/', include('escola.pedagogico.urls')),
    path('coordenacao/', include('escola.coordenacao.urls')),
    path('disciplinar/', include('escola.disciplinar.urls')),
    path('biblioteca/', include('escola.biblioteca.urls')),
    path('api-token-auth/', views.obtain_auth_token, name='api-token-auth'),
]