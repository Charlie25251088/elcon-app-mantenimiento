using ElconAppMantenimiento.Api.Data;
using ElconAppMantenimiento.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ElconAppMantenimiento.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EquiposController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EquiposController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // VER TODOS LOS EQUIPOS
        // ADMINISTRADOR, TÉCNICO Y CLIENTE
        // ==========================================

        [HttpGet]
        [Authorize(Roles = "Administrador,Tecnico,Cliente")]
        public async Task<ActionResult<IEnumerable<Equipo>>> GetEquipos()
        {
            return await _context.Equipos
                .ToListAsync();
        }

        // ==========================================
        // VER UN EQUIPO
        // ADMINISTRADOR, TÉCNICO Y CLIENTE
        // ==========================================

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador,Tecnico,Cliente")]
        public async Task<ActionResult<Equipo>> GetEquipo(int id)
        {
            var equipo = await _context.Equipos
                .FindAsync(id);

            if (equipo == null)
            {
                return NotFound();
            }

            return equipo;
        }

        // ==========================================
        // VER MIS EQUIPOS
        // SOLO CLIENTE
        // ==========================================

        [HttpGet("mis-equipos")]
        [Authorize(Roles = "Cliente")]
        public async Task<ActionResult<IEnumerable<Equipo>>> MisEquipos()
        {
            // Obtener el ID del usuario autenticado desde el JWT
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (userId == null)
            {
                return Unauthorized();
            }

            // Buscar el empleado asociado al usuario
            var empleado = await _context.Empleados
                .FirstOrDefaultAsync(
                    e => e.ApplicationUserId == userId
                );

            if (empleado == null)
            {
                return NotFound(new
                {
                    mensaje = "El usuario no tiene un empleado asociado."
                });
            }

            // Obtener únicamente los equipos pertenecientes
            // al cliente autenticado
            var equipos = await _context.Equipos
                .Where(e => e.ClienteId == empleado.Id)
                .ToListAsync();

            return Ok(equipos);
        }

        // ==========================================
        // CREAR EQUIPO
        // SOLO ADMINISTRADOR
        // ==========================================

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<Equipo>> PostEquipo(
            Equipo equipo)
        {
            // Si se asignó un cliente, comprobar que exista
            if (equipo.ClienteId.HasValue)
            {
                var cliente = await _context.Empleados
                    .FindAsync(equipo.ClienteId.Value);

                if (cliente == null)
                {
                    return BadRequest(new
                    {
                        mensaje = "El cliente especificado no existe."
                    });
                }
            }

            _context.Equipos.Add(equipo);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetEquipo),
                new { id = equipo.Id },
                equipo
            );
        }

        // ==========================================
        // EDITAR EQUIPO
        // SOLO ADMINISTRADOR
        // ==========================================

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutEquipo(
            int id,
            Equipo equipo)
        {
            if (id != equipo.Id)
            {
                return BadRequest();
            }

            // Comprobar que el cliente exista si se asignó uno
            if (equipo.ClienteId.HasValue)
            {
                var cliente = await _context.Empleados
                    .FindAsync(equipo.ClienteId.Value);

                if (cliente == null)
                {
                    return BadRequest(new
                    {
                        mensaje = "El cliente especificado no existe."
                    });
                }
            }

            _context.Entry(equipo).State =
                EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipoExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        // ==========================================
        // ELIMINAR EQUIPO
        // SOLO ADMINISTRADOR
        // ==========================================

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteEquipo(int id)
        {
            var equipo = await _context.Equipos
                .FindAsync(id);

            if (equipo == null)
            {
                return NotFound();
            }

            _context.Equipos.Remove(equipo);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ==========================================
        // COMPROBAR EXISTENCIA
        // ==========================================

        private bool EquipoExists(int id)
        {
            return _context.Equipos
                .Any(e => e.Id == id);
        }
    }
}