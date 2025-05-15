using TelecomSystem.Domain.Entities;

namespace TelecomSystem.Application.Interfaces
{
    public interface IOperadoraService
    {
        Task<IEnumerable<Operadora>> ListarAsync();
        Task<Operadora> ObterPorIdAsync(Guid id);
        Task CriarAsync(Operadora operadora);
        Task AtualizarAsync(Operadora operadora);
        Task ExcluirAsync(Guid id);
    }
}