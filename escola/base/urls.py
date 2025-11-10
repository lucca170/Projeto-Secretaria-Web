# Em: escola/base/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    home, 
    registrar, 
    UserViewSet, 
    dashboard_data, 
    CustomAuthToken,
    password_reset_request,
    password_reset_login  # <-- 1. IMPORTE A NOVA VIEW
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/dashboard/', dashboard_data, name='dashboard_data'),
    
    path('api/login/', CustomAuthToken.as_view(), name='api_login'), 
    
    path('api/password-reset/', password_reset_request, name='password_reset_request'),
    
    # --- 2. ADICIONE A NOVA ROTA DA API ---
    path('api/password-reset-login/', password_reset_login, name='password_reset_login'),

    path('', home, name='home'),
    path('registrar/', registrar, name='registrar'),
]