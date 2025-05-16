using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelecomSystem.Application.Interfaces;
using TelecomSystem.Domain.Entities;

namespace TelecomSystem.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class FiliaisController : ControllerBase
    {
        private readonly IFilialService _service;
        public FiliaisController(IFilialService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.ListarAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var filial = await _service.ObterPorIdAsync(id);
            if (filial == null) return NotFound();
            return Ok(filial);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Filial filial)
        {
            if (filial == null) return BadRequest("Filial não pode ser nula.");
            await _service.CriarAsync(filial);
            return CreatedAtAction(nameof(GetById), new { id = filial.Id }, filial);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Filial filial)
        {
            if (filial == null || filial.Id != id) return BadRequest("Filial inválida.");
            var existingFilial = await _service.ObterPorIdAsync(id);
            if (existingFilial == null) return NotFound();
            await _service.AtualizarAsync(filial);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var filial = await _service.ObterPorIdAsync(id);
            if (filial == null) return NotFound();
            await _service.ExcluirAsync(id);
            return NoContent();
        }



    }
}