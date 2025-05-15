using TelecomSystem.Application.Interfaces;
using TelecomSystem.Domain.Entities;
using TelecomSystem.Domain.Repositories;

namespace TelecomSystem.Application.Services
{

    public class FilialService : IFilialService
    {
        private readonly IFilialRepository _repo;

        public FilialService(IFilialRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Filial>> ListarAsync() => await _repo.ListarAsync();

        public async Task<Filial> ObterPorIdAsync(Guid id) => await _repo.ObterPorIdAsync(id);

        public async Task CriarAsync(Filial filial) => await _repo.CriarAsync(filial);

        public async Task AtualizarAsync(Filial filial) => await _repo.AtualizarAsync(filial);

        public async Task ExcluirAsync(Guid id) => await _repo.ExcluirAsync(id);
    }
}
