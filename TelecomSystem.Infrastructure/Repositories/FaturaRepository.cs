using System.Security.Cryptography.X509Certificates;
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
        // Verifica se já existe uma entidade com esse ID sendo rastreada
        var local = _context.Faturas.Local.FirstOrDefault(e => e.Id == fatura.Id);
        if (local != null)
        {
            // Desanexa a instância local
            _context.Entry(local).State = EntityState.Detached;
        }

        // Depois de desanexar, atualiza com a nova instância
        // Isso garante que o EF Core não tente rastrear a mesma entidade duas vezes
        _context.Faturas.Update(fatura);
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

    public async Task<Object> TotalGastoNoMesAsync(int mes, int ano)
    {
        return await _context.Set<Fatura>()
            .Where(f => f.Contrato != null && f.Contrato.Filial != null && f.DataEmissao.Month == mes && f.DataEmissao.Year == ano)
            .GroupBy(x => new { Filial = x.Contrato.FilialId, StatusFatura = x.Status, Mes = x.DataEmissao.Month, Ano = x.DataEmissao.Year })
            .Select(g => new
            {
                filialId = g.Key.Filial,
                mesAno = $"{g.Key.Mes:D2}/{g.Key.Ano}",
                status = g.Key.StatusFatura,
                filialNome = g.Select(x => x.Contrato != null && x.Contrato.Filial != null ? x.Contrato.Filial.Nome : null).FirstOrDefault(),
                total = g.Sum(x => x.ValorCobrado)
            }).ToListAsync();
    }
}
