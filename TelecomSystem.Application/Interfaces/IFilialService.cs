using TelecomSystem.Domain.Entities;

namespace TelecomSystem.Application.Interfaces
{
    public interface IFilialService
    {
        Task<IEnumerable<Filial>> ListarAsync();
        Task<Filial> ObterPorIdAsync(Guid id);
        Task CriarAsync(Filial filial);
        Task AtualizarAsync(Filial filial);
        Task ExcluirAsync(Guid id);
    }
}