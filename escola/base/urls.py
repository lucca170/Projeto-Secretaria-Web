from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    home, 
    registrar, 
    UserViewSet, 
    dashboard_data, 
    CustomAuthToken 
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/dashboard/', dashboard_data, name='dashboard_data'),
    
    path('api/login/', CustomAuthToken.as_view(), name='api_login'), 

    path('', home, name='home'),
    path('registrar/', registrar, name='registrar'),
]