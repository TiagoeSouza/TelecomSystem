using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelecomSystem.Application.Interfaces;
using TelecomSystem.Domain.Entities;

namespace TelecomSystem.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class ContratosController : ControllerBase
    {
        private readonly IContratoService _service;
        public ContratosController(IContratoService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.ListarAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var contrato = await _service.ObterPorIdAsync(id);
            if (contrato == null) return NotFound();
            return Ok(contrato);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Contrato contrato)
        {
            try
            {
                if (contrato == null)
                    return BadRequest("Contrato não pode ser nulo.");
                if (contrato.DataInicio == DateTime.MinValue || contrato.DataVencimento == DateTime.MinValue)
                    return BadRequest("Data de início ou vencimento inválida.");
                if (contrato.FilialId == Guid.Empty)
                    return BadRequest("Filial não pode ser nula.");
                if (contrato.OperadoraId == Guid.Empty)
                    return BadRequest("Operadora não pode ser nula.");

                contrato.DataInicio = DateTime.SpecifyKind(contrato.DataInicio, DateTimeKind.Utc);
                contrato.DataVencimento = DateTime.SpecifyKind(contrato.DataVencimento, DateTimeKind.Utc);

                // Evita que EF tente criar uma nova Filial/Operadora
                contrato.Filial = null;
                contrato.Operadora = null;

                await _service.CriarAsync(contrato);
                return CreatedAtAction(nameof(GetById), new { id = contrato.Id }, contrato);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao criar contrato: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Contrato contrato)
        {
            if (contrato == null || contrato.Id != id) return BadRequest("Contrato inválida.");
            var existingContrato = await _service.ObterPorIdAsync(id);
            if (existingContrato == null) return NotFound();

            contrato.DataInicio = DateTime.SpecifyKind(contrato.DataInicio, DateTimeKind.Utc);
            contrato.DataVencimento = DateTime.SpecifyKind(contrato.DataVencimento, DateTimeKind.Utc);

            // Evita que EF tente criar uma nova Filial/Operadora
            contrato.Filial = null;
            contrato.Operadora = null;

            await _service.AtualizarAsync(contrato);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var contrato = await _service.ObterPorIdAsync(id);
            if (contrato == null) return NotFound();
            await _service.ExcluirAsync(id);
            return NoContent();
        }



    }
}