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
    public class MantenimientosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MantenimientosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // VER TODOS LOS MANTENIMIENTOS
        // ADMINISTRADOR Y TÉCNICO
        // ==========================================

        [HttpGet]
        [Authorize(Roles = "Administrador,Tecnico")]
        public async Task<ActionResult<IEnumerable<Mantenimiento>>> GetMantenimientos()
        {
            return await _context.Mantenimientos
                .Include(m => m.Equipo)
                .Include(m => m.Tecnico)
                .ToListAsync();
        }

        // ==========================================
        // VER UN MANTENIMIENTO
        // ADMINISTRADOR Y TÉCNICO
        // ==========================================

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador,Tecnico")]
        public async Task<ActionResult<Mantenimiento>> GetMantenimiento(int id)
        {
            var mantenimiento = await _context.Mantenimientos
                .Include(m => m.Equipo)
                .Include(m => m.Tecnico)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (mantenimiento == null)
            {
                return NotFound();
            }

            return mantenimiento;
        }

        // ==========================================
        // MANTENIMIENTOS DEL CLIENTE
        // SOLO CLIENTE
        // ==========================================

        [HttpGet("mis-mantenimientos")]
        [Authorize(Roles = "Cliente")]
        public async Task<ActionResult<IEnumerable<Mantenimiento>>> MisMantenimientos()
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (userId == null)
            {
                return Unauthorized();
            }

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

            var mantenimientos = await _context.Mantenimientos
                .Include(m => m.Equipo)
                .Where(m => m.Equipo!.ClienteId == empleado.Id)
                .ToListAsync();

            return Ok(mantenimientos);
        }



        // ==========================================
        // MANTENIMIENTOS DEL TÉCNICO
        // SOLO TÉCNICO
        // ==========================================

        [HttpGet("mis-mantenimientos-tecnico")]
        [Authorize(Roles = "Tecnico")]
        public async Task<ActionResult<IEnumerable<Mantenimiento>>> MisMantenimientosTecnico()
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (userId == null)
            {
                return Unauthorized();
            }

            var tecnico = await _context.Empleados
                .FirstOrDefaultAsync(
                    e => e.ApplicationUserId == userId
                );

            if (tecnico == null)
            {
                return NotFound(new
                {
                    mensaje = "El usuario no tiene un empleado asociado."
                });
            }

            var mantenimientos = await _context.Mantenimientos
                .Include(m => m.Equipo)
                .Include(m => m.Tecnico)
                .Where(m => m.TecnicoId == tecnico.Id)
                .ToListAsync();

            return Ok(mantenimientos);
        }

        // ==========================================
        // CREAR MANTENIMIENTO
        // SOLO ADMINISTRADOR
        // ==========================================

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<Mantenimiento>> PostMantenimiento(
            Mantenimiento mantenimiento)
        {
            var equipo = await _context.Equipos
                .FindAsync(mantenimiento.EquipoId);

            if (equipo == null)
            {
                return BadRequest(new
                {
                    mensaje = "El equipo especificado no existe."
                });
            }

            if (mantenimiento.TecnicoId.HasValue)
            {
                var tecnico = await _context.Empleados
                    .FindAsync(mantenimiento.TecnicoId.Value);

                if (tecnico == null)
                {
                    return BadRequest(new
                    {
                        mensaje = "El técnico especificado no existe."
                    });
                }
            }

            _context.Mantenimientos.Add(mantenimiento);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetMantenimiento),
                new { id = mantenimiento.Id },
                mantenimiento
            );
        }

        // ==========================================
        // EDITAR MANTENIMIENTO
        // ADMINISTRADOR Y TÉCNICO
        // ==========================================

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador,Tecnico")]
        public async Task<IActionResult> PutMantenimiento(
            int id,
            Mantenimiento mantenimiento)
        {
            if (id != mantenimiento.Id)
            {
                return BadRequest();
            }

            var mantenimientoExistente =
                await _context.Mantenimientos.FindAsync(id);

            if (mantenimientoExistente == null)
            {
                return NotFound();
            }

            var usuarioEsTecnico =
                User.IsInRole("Tecnico");

            // ==========================================
            // EL ADMINISTRADOR PUEDE MODIFICAR TODO
            // ==========================================

            if (User.IsInRole("Administrador"))
            {
                mantenimientoExistente.EquipoId =
                    mantenimiento.EquipoId;

                mantenimientoExistente.Fecha =
                    mantenimiento.Fecha;

                mantenimientoExistente.Tipo =
                    mantenimiento.Tipo;

                mantenimientoExistente.Descripcion =
                    mantenimiento.Descripcion;

                mantenimientoExistente.Estado =
                    mantenimiento.Estado;

                mantenimientoExistente.Observaciones =
                    mantenimiento.Observaciones;

                mantenimientoExistente.TecnicoId =
                    mantenimiento.TecnicoId;
            }

            // ==========================================
            // EL TÉCNICO SOLO PUEDE MODIFICAR SU
            // MANTENIMIENTO
            // ==========================================

            else if (usuarioEsTecnico)
            {
                var userId = User.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );

                var tecnico = await _context.Empleados
                    .FirstOrDefaultAsync(
                        e => e.ApplicationUserId == userId
                    );

                if (tecnico == null)
                {
                    return Unauthorized();
                }

                if (mantenimientoExistente.TecnicoId
                    != tecnico.Id)
                {
                    return Forbid();
                }

                mantenimientoExistente.Estado =
                    mantenimiento.Estado;

                mantenimientoExistente.Observaciones =
                    mantenimiento.Observaciones;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ==========================================
        // ELIMINAR MANTENIMIENTO
        // SOLO ADMINISTRADOR
        // ==========================================

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteMantenimiento(int id)
        {
            var mantenimiento = await _context.Mantenimientos
                .FindAsync(id);

            if (mantenimiento == null)
            {
                return NotFound();
            }

            _context.Mantenimientos.Remove(mantenimiento);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}