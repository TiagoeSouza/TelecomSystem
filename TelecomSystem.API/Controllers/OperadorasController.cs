using Microsoft.AspNetCore.Mvc;
using TelecomSystem.Application.Interfaces;
using TelecomSystem.Domain.Entities;

namespace TelecomSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OperadorasController : ControllerBase
    {
        private readonly IOperadoraService _service;
        public OperadorasController(IOperadoraService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.ListarAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var operadora = await _service.ObterPorIdAsync(id);
            if (operadora == null) return NotFound();
            return Ok(operadora);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Operadora operadora)
        {
            if (operadora == null) return BadRequest("Operadora não pode ser nula.");
            await _service.CriarAsync(operadora);
            return CreatedAtAction(nameof(GetById), new { id = operadora.Id }, operadora);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Operadora operadora)
        {
            if (operadora == null || operadora.Id != id) return BadRequest("Operadora inválida.");
            var existingOperadora = await _service.ObterPorIdAsync(id);
            if (existingOperadora == null) return NotFound();
            await _service.AtualizarAsync(operadora);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var operadora = await _service.ObterPorIdAsync(id);
            if (operadora == null) return NotFound();
            await _service.ExcluirAsync(id);
            return NoContent();
        }



    }
}