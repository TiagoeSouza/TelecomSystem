using Microsoft.EntityFrameworkCore;
using TelecomSystem.Domain.Entities;
using TelecomSystem.Domain.Repositories;
using TelecomSystem.Infrastructure;

public class ContratoRepository : IContratoRepository
{
    private readonly TelecomDbContext _context;

    public ContratoRepository(TelecomDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Contrato>> ListarAsync()
    {
        return await _context.Contratos.Include(c => c.Operadora).ToListAsync();
    }

    public async Task<Contrato> ObterPorIdAsync(Guid id)
    {
        return await _context.Contratos.Include(c => c.Operadora).FirstOrDefaultAsync(c => c.Id == id) ?? new Contrato();
        //?? throw new InvalidOperationException("Contrato não encontrado");
    }

    public async Task CriarAsync(Contrato contrato)
    {
        _context.Contratos.Add(contrato);
        await _context.SaveChangesAsync();
    }

    public async Task AtualizarAsync(Contrato contrato)
    {
        _context.Contratos.Update(contrato);
        await _context.SaveChangesAsync();
    }

    public async Task ExcluirAsync(Guid id)
    {
        var contrato = await _context.Contratos.FindAsync(id);
        if (contrato != null)
        {
            _context.Contratos.Remove(contrato);
            await _context.SaveChangesAsync();
        }
    }
}
