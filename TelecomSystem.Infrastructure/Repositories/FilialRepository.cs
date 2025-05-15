using Microsoft.EntityFrameworkCore;
using TelecomSystem.Domain.Entities;
using TelecomSystem.Domain.Repositories;
using TelecomSystem.Infrastructure;

public class FilialRepository : IFilialRepository
{
    private readonly TelecomDbContext _context;

    public FilialRepository(TelecomDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Filial>> ListarAsync()
    {
        return await _context.Filiais.ToListAsync();
    }

    public async Task<Filial> ObterPorIdAsync(Guid id)
    {
        return await _context.Filiais.FindAsync(id)
               ?? throw new InvalidOperationException("Filial não encontrada");
    }

    public async Task CriarAsync(Filial filial)
    {
        await _context.Filiais.AddAsync(filial);
        await _context.SaveChangesAsync();
    }

    public async Task AtualizarAsync(Filial filial)
    {
        // Verifica se já existe uma entidade com esse ID sendo rastreada
        var local = _context.Filiais.Local.FirstOrDefault(e => e.Id == filial.Id);
        if (local != null)
        {
            // Desanexa a instância local
            _context.Entry(local).State = EntityState.Detached;
        }

        // Depois de desanexar, atualiza com a nova instância
        // Isso garante que o EF Core não tente rastrear a mesma entidade duas vezes
        _context.Filiais.Update(filial);
        await _context.SaveChangesAsync();
    }

    public async Task ExcluirAsync(Guid id)
    {
        var filial = await ObterPorIdAsync(id);
        if (filial != null)
        {
            _context.Filiais.Remove(filial);
            await _context.SaveChangesAsync();
        }
    }
}
