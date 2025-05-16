using System.Net;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TelecomSystem.API.BackgroundServices;
using TelecomSystem.Application.Interfaces;
using TelecomSystem.Application.Services;
using TelecomSystem.Domain.Repositories;
using TelecomSystem.Domain.Services;
using TelecomSystem.Infrastructure;
using TelecomSystem.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
    });

    options.AddPolicy("AllowLocalhostAnyPort", policy =>
      {
          policy.SetIsOriginAllowed(origin => origin.StartsWith("http://localhost"))
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
      });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<TelecomDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Mapeia interfaces para suas implementações para uso com injeção de dependência.
// AddScoped cria uma instância por requisição HTTP.
// Necessário para que os serviços funcionem corretamente nos controllers.
builder.Services.AddScoped<IOperadoraService, OperadoraService>();
builder.Services.AddScoped<IContratoService, ContratoService>();
builder.Services.AddScoped<IFaturaService, FaturaService>();
builder.Services.AddScoped<IFilialService, FilialService>();
builder.Services.AddScoped<IUserAuthService, UserAuthService>();

builder.Services.AddScoped<IOperadoraRepository, OperadoraRepository>();
builder.Services.AddScoped<IContratoRepository, ContratoRepository>();
builder.Services.AddScoped<IFaturaRepository, FaturaRepository>();
builder.Services.AddScoped<IFilialRepository, FilialRepository>();
builder.Services.AddScoped<IUserAuthRepository, UserAuthRepository>();



IConfigurationSection jwtSettings = builder.Configuration.GetSection("Jwt");
string chave = jwtSettings["Key"]?.ToString() ?? throw new InvalidOperationException("JWT Não está configurado.");
string issuer = jwtSettings["Issuer"]?.ToString() ?? throw new InvalidOperationException("JWT Não está configurado.");
string audience = jwtSettings["Audience"]?.ToString() ?? throw new InvalidOperationException("JWT Não está configurado.");
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chave)),
        };
    });

// Registrar o serviço de email com parâmetros do appsettings
builder.Services.AddTransient<IEmailSender>(sp =>
    new MimeEmailSender(
        builder.Configuration["Smtp:Host"],
        int.Parse(builder.Configuration["Smtp:Port"]),
        builder.Configuration["Smtp:User"],
        builder.Configuration["Smtp:Pass"],
        builder.Configuration["Smtp:Destinatario"]
    )
);
// Registrar serviço de aplicação
builder.Services.AddScoped<PlanoVencimentoNotificationService>();

// Registrar o HostedService
builder.Services.AddHostedService<PlanoVencimentoWorker>();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    // Executando o migration para criar o banco de dados
    // e as tabelas necessárias
    var db = scope.ServiceProvider.GetRequiredService<TelecomDbContext>();
    db.Database.Migrate();

    // Populando o banco de dados com dados iniciais
    var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
    TelecomDbContext.Seed(scope.ServiceProvider, loggerFactory);
}


app.UseCors("AllowLocalhostAnyPort");
app.UseAuthentication();
app.UseAuthorization();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.UseCors("AllowAngularDev");
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseCors("ProductionCors"); // Caso seja publicado
    app.UseHttpsRedirection();
}

// var summaries = new[]
// {
//     "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
// };

// app.MapGet("/weatherforecast", () =>
// {
//     var forecast = Enumerable.Range(1, 5).Select(index =>
//         new WeatherForecast
//         (
//             DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
//             Random.Shared.Next(-20, 55),
//             summaries[Random.Shared.Next(summaries.Length)]
//         ))
//         .ToArray();
//     return forecast;
// })
// .WithName("GetWeatherForecast")
// .WithOpenApi();

app.MapControllers();

app.Run();

// record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
// {
//     public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
// }
