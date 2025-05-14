using TelecomSystem.Domain.Entities;

namespace TelecomSystem.Domain.Repositories
{
    public interface IFaturaRepository
    {
        Task<IEnumerable<Fatura>> ListarAsync();
        Task<Fatura> ObterPorIdAsync(Guid id);
        Task CriarAsync(Fatura fatura);
        Task AtualizarAsync(Fatura fatura);
        Task ExcluirAsync(Guid id);
        Task<decimal> TotalGastoNoMesAsync(int mes, int ano);
    }
}