using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace TelecomSystem.Infrastructure
{
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
