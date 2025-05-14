using TelecomSystem.Domain.Entities;

namespace TelecomSystem.Application.Interfaces
{
    public interface IContratoService
    {
        Task<IEnumerable<Contrato>> ListarAsync();
        Task<Contrato> ObterPorIdAsync(Guid id);
        Task CriarAsync(Contrato contrato);
        Task AtualizarAsync(Contrato contrato);
        Task ExcluirAsync(Guid id);
    }
}