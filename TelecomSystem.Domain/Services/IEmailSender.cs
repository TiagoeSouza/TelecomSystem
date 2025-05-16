using TelecomSystem.Domain.Entities;

namespace TelecomSystem.Domain.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string subject, string message);
    }
}
