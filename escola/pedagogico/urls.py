from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Adicione os URLs das suas outras aplicações aqui
    path('', include('base.urls')), 
    # Exemplo: path('pedagogico/', include('pedagogico.urls')),
]