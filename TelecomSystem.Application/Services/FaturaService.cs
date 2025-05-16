using TelecomSystem.Application.Interfaces;
using TelecomSystem.Domain.Entities;
using TelecomSystem.Domain.Repositories;

namespace TelecomSystem.Application.Services
{

    public class FaturaService : IFaturaService
    {
        private readonly IFaturaRepository _repo;

        public FaturaService(IFaturaRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Fatura>> ListarAsync() => await _repo.ListarAsync();

        public async Task<Fatura> ObterPorIdAsync(Guid id) => await _repo.ObterPorIdAsync(id);

        public async Task CriarAsync(Fatura fatura) => await _repo.CriarAsync(fatura);

        public async Task AtualizarAsync(Fatura fatura) => await _repo.AtualizarAsync(fatura);

        public async Task ExcluirAsync(Guid id) => await _repo.ExcluirAsync(id);

        public async Task<Object> ObterTotalGastoNoMesAsync(int mes, int ano) => await _repo.TotalGastoNoMesAsync(mes, ano);
    }
}