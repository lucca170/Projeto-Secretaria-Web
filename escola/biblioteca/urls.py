# Em: escola/biblioteca/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'livros', views.LivroViewSet, basename='livro')
router.register(r'emprestimos', views.EmprestimoViewSet, basename='emprestimo')
router.register(r'autores', views.AutorViewSet, basename='autor') # <-- ADICIONADO

# Ação customizada 'emprestar'
emprestar_livro = views.EmprestimoViewSet.as_view({
    'post': 'emprestar'
})

# Ação customizada 'devolver'
devolver_livro = views.EmprestimoViewSet.as_view({
    'post': 'devolver'
})

urlpatterns = [
    path('api/', include(router.urls)),
    
    path('api/livros/<int:pk>/emprestar/', emprestar_livro, name='livro-emprestar'),
    path('api/emprestimos/<int:pk>/devolver/', devolver_livro, name='emprestimo-devolver'),
]