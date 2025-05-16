using TelecomSystem.Application.Services;

namespace TelecomSystem.API.BackgroundServices
{
    public class PlanoVencimentoWorker : BackgroundService
    {
        private readonly ILogger<PlanoVencimentoWorker> _logger;
        private readonly IServiceScopeFactory _scopeFactory;

        public PlanoVencimentoWorker(
            ILogger<PlanoVencimentoWorker> logger,
            IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Serviço de verificação de planos iniciado.");

            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var notificacaoService = scope.ServiceProvider
                        .GetRequiredService<PlanoVencimentoNotificationService>();

                    await notificacaoService.VerificarPlanosVencendoAsync();
                }

                // Executar a cada 24h
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }

            _logger.LogInformation("Serviço de verificação de planos finalizado.");
        }
    }
}
