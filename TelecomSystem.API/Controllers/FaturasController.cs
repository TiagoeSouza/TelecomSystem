using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TelecomSystem.Application.Interfaces;
using TelecomSystem.Domain.Entities;

namespace TelecomSystem.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class FaturasController : ControllerBase
    {
        private readonly IFaturaService _service;
        public FaturasController(IFaturaService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.ListarAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var fatura = await _service.ObterPorIdAsync(id);
            if (fatura == null) return NotFound();
            return Ok(fatura);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Fatura fatura)
        {
            if (fatura == null) return BadRequest("Fatura não pode ser nula.");

            fatura.DataEmissao = DateTime.SpecifyKind(fatura.DataEmissao, DateTimeKind.Utc);
            fatura.DataVencimento = DateTime.SpecifyKind(fatura.DataVencimento, DateTimeKind.Utc);

            // Evita que EF tente criar uma nova Filial/Operadora
            fatura.Contrato = null;

            await _service.CriarAsync(fatura);
            return CreatedAtAction(nameof(GetById), new { id = fatura.Id }, fatura);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Fatura fatura)
        {
            if (fatura == null || fatura.Id != id) return BadRequest("Fatura inválida.");
            var existingFatura = await _service.ObterPorIdAsync(id);
            if (existingFatura == null) return NotFound();
            fatura.DataEmissao = DateTime.SpecifyKind(fatura.DataEmissao, DateTimeKind.Utc);

            fatura.DataVencimento = DateTime.SpecifyKind(fatura.DataVencimento, DateTimeKind.Utc);

            // Evita que EF tente criar uma nova Filial/Operadora
            fatura.Contrato = null;

            await _service.AtualizarAsync(fatura);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var fatura = await _service.ObterPorIdAsync(id);
                if (fatura == null) return NotFound();
                await _service.ExcluirAsync(id);
                return NoContent();
            }
            catch (DbUpdateException ex) when (ex.InnerException != null)
            {
                return BadRequest("Não é possível excluir, pois o registro possui dados relacionados.");
            }
        }

        [HttpGet("total-gasto-mes/{mes}/{ano}")]
        public async Task<IActionResult> TotalGastoNoMes(int mes, int ano)
        {
            var totaisAgrupagos = await _service.ObterTotalGastoNoMesAsync(mes, ano);
            return Ok(totaisAgrupagos);
        }

    }
}