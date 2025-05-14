using TelecomSystem.Application.Interfaces;
using TelecomSystem.Domain.Entities;
using TelecomSystem.Domain.Repositories;

namespace TelecomSystem.Application.Services{
    public class ContratoService : IContratoService
    {
        private readonly IContratoRepository _repo;

        public ContratoService(IContratoRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Contrato>> ListarAsync() => await _repo.ListarAsync();

        public async Task<Contrato> ObterPorIdAsync(Guid id) => await _repo.ObterPorIdAsync(id);

        public async Task CriarAsync(Contrato contrato) => await _repo.CriarAsync(contrato);

        public async Task AtualizarAsync(Contrato contrato) => await _repo.AtualizarAsync(contrato);

        public async Task ExcluirAsync(Guid id) => await _repo.ExcluirAsync(id);
    }
}