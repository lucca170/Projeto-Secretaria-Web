from django.apps import AppConfig

class PedagogicoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'escola.pedagogico'

    def ready(self):
        # Importa os signals quando o app estiver pronto
        import escola.pedagogico.signals