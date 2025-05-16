using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TelecomSystem.Domain.Entities;
using TelecomSystem.Domain.Services;
using TelecomSystem.Infrastructure;

namespace TelecomSystem.Application.Services
{
    public class PlanoVencimentoNotificationService
    {
        private readonly TelecomDbContext _context;
        private readonly IEmailSender _emailSender;

        public PlanoVencimentoNotificationService(TelecomDbContext context, IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
        }

        public async Task VerificarPlanosVencendoAsync()
        {
            var hoje = DateTime.UtcNow.Date;
            var limite = hoje.AddDays(5);

            var faturasVencendo = await _context.Faturas
                .Where(c => c.Status == StatusFatura.Pendente &&
                            c.DataVencimento.Date >= hoje &&
                            c.DataVencimento.Date <= limite)
                .Include(c => c.Contrato)
                    .ThenInclude(c => c.Filial)
                .Include(f => f.Contrato)
                    .ThenInclude(c => c.Operadora)
                .ToListAsync();

            foreach (var fatura in faturasVencendo)
            {

                var assunto = $"Plano {fatura.Contrato.PlanoContratado} está vencendo em breve";
                var corpo = $"Olá, seu plano {fatura.Contrato.PlanoContratado} da filial {fatura.Contrato.Filial.Nome} e operadora {fatura.Contrato.Operadora.Nome} vence em {fatura.Contrato.DataVencimento:d}.";

                await _emailSender.SendEmailAsync(assunto, corpo);
            }
        }
    }
}
