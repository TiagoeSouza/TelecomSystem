using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace TelecomSystem.Infrastructure
{
    // Criado para permitir a criação de migrações e o uso do comando Update-Database no Package Manage
    // Isso é útil para criar migrações e atualizar o banco de dados sem precisar executar a aplicação.
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<TelecomDbContext>
    {
        public TelecomDbContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<TelecomDbContext>();
            var connectionString = configuration.GetConnectionString("Default");

            optionsBuilder.UseNpgsql(connectionString);

            return new TelecomDbContext(optionsBuilder.Options);
        }
    }
}
