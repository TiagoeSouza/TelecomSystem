using TelecomSystem.Application.Interfaces;
using TelecomSystem.Domain.Entities;
using TelecomSystem.Domain.Repositories;

namespace TelecomSystem.Application.Services{

public class OperadoraService : IOperadoraService
{
    private readonly IOperadoraRepository _repo;

    public OperadoraService(IOperadoraRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<Operadora>> ListarAsync() => await _repo.ListarAsync();

    public async Task<Operadora> ObterPorIdAsync(Guid id) => await _repo.ObterPorIdAsync(id);

    public async Task CriarAsync(Operadora operadora) => await _repo.CriarAsync(operadora);

    public async Task AtualizarAsync(Operadora operadora) => await _repo.AtualizarAsync(operadora);

    public async Task ExcluirAsync(Guid id) => await _repo.ExcluirAsync(id);
}
}