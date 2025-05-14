using TelecomSystem.Domain.Entities;

namespace TelecomSystem.Domain.Repositories
{
    public interface IOperadoraRepository
    {
        Task<IEnumerable<Operadora>> ListarAsync();
        Task<Operadora> ObterPorIdAsync(Guid id);
        Task CriarAsync(Operadora operadora);
        Task AtualizarAsync(Operadora operadora);
        Task ExcluirAsync(Guid id);
    }
}