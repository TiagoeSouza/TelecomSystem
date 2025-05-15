using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using TelecomSystem.Application.Interfaces;
using TelecomSystem.Domain.Entities;

namespace TelecomSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserAuthController : ControllerBase
    {
        private readonly IUserAuthService _service;
        public UserAuthController(IUserAuthService service) => _service = service;


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserAuth login)
        {
            if (login == null)
                return BadRequest("Usuário ou senha inválidos.");
            if (string.IsNullOrEmpty(login.UserEmail) || string.IsNullOrEmpty(login.UserEmail))
                return BadRequest("Usuário ou senha inválidos.");

            var authorizedUser = await _service.Authorized(login);
            if (authorizedUser)
            {
                IConfigurationRoot _config = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json")
                    .Build();

                string token = GerarToken(login, _config);
                return Ok(new { token });
            }

            return Unauthorized("Usuário ou senha inválidos.");
        }

        private string GerarToken(UserAuth login, IConfiguration config)
        {
            try
            {
                IConfigurationSection jwtSettings = config.GetSection("Jwt");
                string chave = jwtSettings["Key"]?.ToString() ?? throw new InvalidOperationException("JWT Não está configurado.");
                string issuer = jwtSettings["Issuer"]?.ToString() ?? throw new InvalidOperationException("JWT Não está configurado.");
                string audience = jwtSettings["Audience"]?.ToString() ?? throw new InvalidOperationException("JWT Não está configurado.");
                string expiresInHours = jwtSettings["ExpiresInHours"]?.ToString() ?? throw new InvalidOperationException("JWT Não está configurado.");

                SymmetricSecurityKey _chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chave));
                SigningCredentials creds = new SigningCredentials(_chave, SecurityAlgorithms.HmacSha256);

                JwtSecurityToken token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims:
                    [
                        // new Claim(ClaimTypes.NameIdentifier, login.Id.ToString()),
                        new Claim(ClaimTypes.Name, login.UserEmail),
                        // Todos serão administradores, visto que não teremos regras de diferenças entre usuários no momento
                        new Claim(ClaimTypes.Role, "Admin")
                    ],
                    expires: DateTime.UtcNow.AddHours(double.Parse(expiresInHours)),
                    signingCredentials: creds
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                throw new Exception("Erro ao gerar token: " + ex.Message);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserAuth userAuth)
        {
            // Validando o modelo
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (userAuth == null)
                return BadRequest("Usuário inválido.");
            if (string.IsNullOrEmpty(userAuth.UserEmail) || string.IsNullOrEmpty(userAuth.Password))
                return BadRequest("Usuário inválido.");

            var createdUser = await _service.CreateUserAuth(userAuth);
            if (createdUser != null)
                return CreatedAtAction(nameof(Login), new { id = createdUser.Id }, createdUser);

            return BadRequest("Erro ao criar usuário.");
        }

    }
}