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
        public DbSet<Filial> Filiais { get; set; }
        public DbSet<Fatura> Faturas { get; set; }
        public DbSet<UserAuth> UserAuths { get; set; }

        public TelecomDbContext(DbContextOptions<TelecomDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Globalmente desativa Cascade Delete
            foreach (var relationship in modelBuilder.Model.GetEntityTypes()
                .SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }


        public static void Seed(IServiceProvider serviceProvider, ILoggerFactory loggerFactory)
        {
            using (var context = new TelecomDbContext(serviceProvider.GetRequiredService<DbContextOptions<TelecomDbContext>>()))
            {
                try
                {
                    // Verifique se o banco de dados foi criado e as migrações aplicadas
                    context.Database.Migrate();

                    // ****************************
                    // Adicionando dados iniciais
                    // ****************************
                    if (!context.UserAuths.Any())
                    {
                        context.UserAuths.AddRange(
                            new UserAuth { Id = Guid.NewGuid(), UserEmail = "tiago.souza@telecomsystem.com", Password = "123456" },
                            new UserAuth { Id = Guid.NewGuid(), UserEmail = "admin@telecomsystem.com", Password = "123456" }
                        );
                    }

                    Guid idOperadora = Guid.NewGuid();
                    if (!context.Operadoras.Any())
                    {
                        context.Operadoras.AddRange(
                                new Operadora { Id = idOperadora, Nome = "Vivo", TipoServico = TipoServico.Móvel, ContatoSuporte = "0800-1000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "Claro", TipoServico = TipoServico.Internet, ContatoSuporte = "0800-2000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "Oi", TipoServico = TipoServico.Fixo, ContatoSuporte = "0800-3000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "Tim", TipoServico = TipoServico.Móvel, ContatoSuporte = "0800-4000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "Nextel", TipoServico = TipoServico.Móvel, ContatoSuporte = "0800-5000" },
                                new Operadora { Id = Guid.NewGuid(), Nome = "Sky", TipoServico = TipoServico.Fixo, ContatoSuporte = "0800-6000" }
                        );
                    }

                    Guid idFilialCentro = Guid.NewGuid();
                    if (!context.Filiais.Any())
                    {

                        context.Filiais.AddRange(
                            new Filial { Id = idFilialCentro, Nome = "Filial Centro", Cnpj = "08.488.674/0001-99" },
                            new Filial { Id = Guid.NewGuid(), Nome = "Filial Norte", Cnpj = "81.596.898/0001-04" },
                            new Filial { Id = Guid.NewGuid(), Nome = "Filial Sul", Cnpj = "26.492.764/0001-35" }
                        );
                    }

                    Guid contratoId1 = Guid.NewGuid();
                    Guid contratoId2 = Guid.NewGuid();
                    if (!context.Contratos.Any())
                    {
                        context.Contratos.AddRange(
                            new Contrato
                            {
                                Id = contratoId1,
                                FilialId = idFilialCentro,
                                OperadoraId = idOperadora,
                                PlanoContratado = "Plano - Semestral",
                                DataInicio = DateTime.UtcNow,
                                DataVencimento = DateTime.UtcNow.AddMonths(6),
                                ValorMensal = 500.00m,
                                Status = 'A'
                            },
                            new Contrato
                            {
                                Id = contratoId2,
                                FilialId = idFilialCentro,
                                OperadoraId = idOperadora,
                                PlanoContratado = "Plano - Anual",
                                DataInicio = DateTime.UtcNow,
                                DataVencimento = DateTime.UtcNow.AddMonths(12),
                                ValorMensal = 1000.00m,
                                Status = 'A'
                            }
                        );
                    }

                    if (!context.Faturas.Any())
                    {
                        context.Faturas.AddRange(
                            new Fatura
                            {
                                Id = Guid.NewGuid(),
                                ContratoId = contratoId1,
                                DataEmissao = DateTime.UtcNow,
                                DataVencimento = DateTime.UtcNow,
                                ValorCobrado = 500.00m * 6,
                                Status = 0
                            },
                            new Fatura
                            {
                                Id = Guid.NewGuid(),
                                ContratoId = contratoId2,
                                DataEmissao = DateTime.UtcNow,
                                DataVencimento = DateTime.UtcNow,
                                ValorCobrado = 1000.00m * 12,
                                Status = (StatusFatura)1,
                            }
                        );
                    }

                    context.SaveChanges(acceptAllChangesOnSuccess: true);
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
