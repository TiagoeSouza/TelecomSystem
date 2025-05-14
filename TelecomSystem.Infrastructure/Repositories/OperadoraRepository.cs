using Microsoft.EntityFrameworkCore;
using TelecomSystem.Domain.Entities;
using TelecomSystem.Domain.Repositories;
using TelecomSystem.Infrastructure;

public class OperadoraRepository : IOperadoraRepository
{
    private readonly TelecomDbContext _context;

    public OperadoraRepository(TelecomDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Operadora>> ListarAsync()
    {
        return await _context.Operadoras.ToListAsync();
    }

    public async Task<Operadora> ObterPorIdAsync(Guid id)
    {
        return await _context.Operadoras.FindAsync(id) ?? new Operadora();
    }

    public async Task CriarAsync(Operadora operadora)
    {
        await _context.Operadoras.AddAsync(operadora);
        await _context.SaveChangesAsync();
    }

    public async Task AtualizarAsync(Operadora operadora)
    {
        _context.Operadoras.Update(operadora);
        await _context.SaveChangesAsync();
    }

    public async Task ExcluirAsync(Guid id)
    {
        var operadora = await ObterPorIdAsync(id);
        if (operadora != null)
        {
            _context.Operadoras.Remove(operadora);
            await _context.SaveChangesAsync();
        }
    }
}
