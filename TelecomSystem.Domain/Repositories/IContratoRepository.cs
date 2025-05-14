using TelecomSystem.Domain.Entities;

namespace TelecomSystem.Domain.Repositories
{
    public interface IContratoRepository
    {
        Task<IEnumerable<Contrato>> ListarAsync();
        Task<Contrato> ObterPorIdAsync(Guid id);
        Task CriarAsync(Contrato contrato);
        Task AtualizarAsync(Contrato contrato);
        Task ExcluirAsync(Guid id);
    }
}