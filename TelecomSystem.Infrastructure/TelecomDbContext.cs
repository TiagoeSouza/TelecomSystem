using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using TelecomSystem.Domain.Entities;

namespace TelecomSystem.Infrastructure
{
    public class TelecomDbContext : DbContext
    {
        public DbSet<Operadora> Operadoras { get; set; }
        public DbSet<Contrato> Contratos { get; set; }
        public DbSet<Filial> Filial { get; set; }
        public DbSet<Fatura> Faturas { get; set; }

        public TelecomDbContext(DbContextOptions<TelecomDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Fluent API aqui, se necessário
        }

        public static void Seed(IServiceProvider serviceProvider, ILoggerFactory loggerFactory)
        {
            using (var context = new TelecomDbContext(serviceProvider.GetRequiredService<DbContextOptions<TelecomDbContext>>()))
            {
                try
                {
                    // Verifique se o banco de dados foi criado e as migrações aplicadas
                    context.Database.Migrate();

                    if (!context.Operadoras.Any())
                    {
                        // Adicionando dados iniciais
                        context.Operadoras.AddRange(
                                new Operadora { Id = Guid.NewGuid(), Nome = "Vivo", TipoServico = TipoServico.Móvel, ContatoSuporte = "0800-1000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "Claro", TipoServico = TipoServico.Internet, ContatoSuporte = "0800-2000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "Oi", TipoServico = TipoServico.Fixo, ContatoSuporte = "0800-3000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "Tim", TipoServico = TipoServico.Móvel, ContatoSuporte = "0800-4000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "Nextel", TipoServico = TipoServico.Móvel, ContatoSuporte = "0800-5000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "Sky", TipoServico = TipoServico.Móvel, ContatoSuporte = "0800-6000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "NET", TipoServico = TipoServico.Internet, ContatoSuporte = "0800-7000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "Vivo Empresas", TipoServico = TipoServico.Fixo, ContatoSuporte = "0800-8000" }
                        );

                        context.SaveChanges();
                    }
                }
                catch (Exception ex)
                {
                    var logger = loggerFactory.CreateLogger<TelecomDbContext>();
                    logger.LogError(ex, "An error occurred seeding the database.");
                }
            }
        }
    }
}
