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
        return await _context.Contratos.Include(c => c.Operadora).Include(c => c.Filial).ToListAsync();
    }

    public async Task<Contrato> ObterPorIdAsync(Guid id)
    {
        return await _context.Contratos.Include(c => c.Operadora).FirstOrDefaultAsync(c => c.Id == id)
               ?? throw new InvalidOperationException("Contrato não encontrado");
    }

    public async Task CriarAsync(Contrato contrato)
    {
        _context.Contratos.Add(contrato);
        await _context.SaveChangesAsync();
    }

    public async Task AtualizarAsync(Contrato contrato)
    {
        // Verifica se já existe uma entidade com esse ID sendo rastreada
        var local = _context.Contratos.Local.FirstOrDefault(e => e.Id == contrato.Id);
        if (local != null)
        {
            // Desanexa a instância local
            _context.Entry(local).State = EntityState.Detached;
        }

        // Depois de desanexar, atualiza com a nova instância
        // Isso garante que o EF Core não tente rastrear a mesma entidade duas vezes
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
