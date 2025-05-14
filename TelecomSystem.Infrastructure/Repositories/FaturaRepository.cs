using Microsoft.EntityFrameworkCore;
using TelecomSystem.Domain.Entities;
using TelecomSystem.Domain.Repositories;
using TelecomSystem.Infrastructure;

public class FaturaRepository : IFaturaRepository
{
    private readonly TelecomDbContext _context;

    public FaturaRepository(TelecomDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Fatura>> ListarAsync()
    {
        return await _context.Set<Fatura>().ToListAsync();
    }

    public async Task<Fatura> ObterPorIdAsync(Guid id)
    {
        var fatura = await _context.Set<Fatura>().FindAsync(id);
        return fatura ?? throw new InvalidOperationException("Fatura not found.");
    }

    public async Task CriarAsync(Fatura fatura)
    {
        await _context.Set<Fatura>().AddAsync(fatura);
        await _context.SaveChangesAsync();
    }

    public async Task AtualizarAsync(Fatura fatura)
    {
        _context.Set<Fatura>().Update(fatura);
        await _context.SaveChangesAsync();
    }

    public async Task ExcluirAsync(Guid id)
    {
        var fatura = await ObterPorIdAsync(id);
        if (fatura != null)
        {
            _context.Set<Fatura>().Remove(fatura);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<decimal> TotalGastoNoMesAsync(int mes, int ano)
    {
        return await _context.Set<Fatura>()
            .Where(f => f.DataEmissao.Month == mes && f.DataEmissao.Year == ano)
            .SumAsync(f => f.ValorCobrado);
    }
}
