
using TelecomSystem.Domain.Entities;
namespace TelecomSystem.Application.Interfaces
{
    public interface IFaturaService
    {
        Task<IEnumerable<Fatura>> ListarAsync();
        Task<Fatura> ObterPorIdAsync(Guid id);
        Task CriarAsync(Fatura fatura);
        Task AtualizarAsync(Fatura fatura);
        Task ExcluirAsync(Guid id);
        Task<decimal> ObterTotalGastoNoMesAsync(int mes, int ano);
    }
}