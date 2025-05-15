using TelecomSystem.Domain.Entities;

namespace TelecomSystem.Domain.Repositories
{
    public interface IFilialRepository
    {
        Task<IEnumerable<Filial>> ListarAsync();
        Task<Filial> ObterPorIdAsync(Guid id);
        Task CriarAsync(Filial filial);
        Task AtualizarAsync(Filial filial);
        Task ExcluirAsync(Guid id);
    }
}