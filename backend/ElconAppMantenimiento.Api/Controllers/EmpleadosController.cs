using ElconAppMantenimiento.Api.Data;
using ElconAppMantenimiento.Api.DTOs;
using ElconAppMantenimiento.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace ElconAppMantenimiento.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Administrador")]
    public class EmpleadosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmpleadosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // OBTENER TODOS LOS EMPLEADOS
        // SOLO ADMINISTRADOR
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Empleado>>> GetEmpleados()
        {
            return await _context.Empleados
                .Include(e => e.ApplicationUser)
                .ToListAsync();
        }

        // ==========================================
        // OBTENER EMPLEADO POR ID
        // SOLO ADMINISTRADOR
        // ==========================================

        //[HttpGet("{id}")]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Empleado>> GetEmpleado(int id)
        {
            var empleado = await _context.Empleados
                .Include(e => e.ApplicationUser)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (empleado == null)
            {
                return NotFound();
            }

            return empleado;
        }

        // ==========================================
        // CREAR EMPLEADO
        // SOLO ADMINISTRADOR
        // ==========================================

        [HttpPost]
        public async Task<ActionResult<Empleado>> PostEmpleado(
            EmpleadoDto dto)
        {
            if (!string.IsNullOrEmpty(dto.ApplicationUserId))
            {
                var usuario = await _context.Users
                    .FindAsync(dto.ApplicationUserId);

                if (usuario == null)
                {
                    return BadRequest(new
                    {
                        mensaje = "El usuario de Identity no existe."
                    });
                }

                var empleadoExistente = await _context.Empleados
                    .AnyAsync(e =>
                        e.ApplicationUserId == dto.ApplicationUserId);

                if (empleadoExistente)
                {
                    return BadRequest(new
                    {
                        mensaje = "Este usuario ya tiene un empleado asociado."
                    });
                }
            }

            var empleado = new Empleado
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Cedula = dto.Cedula,
                Telefono = dto.Telefono,
                Email = dto.Email,
                ApplicationUserId = string.IsNullOrWhiteSpace(
                    dto.ApplicationUserId)
                    ? null
                    : dto.ApplicationUserId,
                Activo = dto.Activo
            };

            _context.Empleados.Add(empleado);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetEmpleado),
                new { id = empleado.Id },
                empleado
            );
        }

        // ==========================================
        // EDITAR EMPLEADO
        // SOLO ADMINISTRADOR
        // ==========================================

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmpleado(
            int id,
            EmpleadoDto dto)
        {
            var empleado = await _context.Empleados
                .FindAsync(id);

            if (empleado == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(dto.ApplicationUserId))
            {
                var usuario = await _context.Users
                    .FindAsync(dto.ApplicationUserId);

                if (usuario == null)
                {
                    return BadRequest(new
                    {
                        mensaje = "El usuario de Identity no existe."
                    });
                }

                var empleadoConUsuario = await _context.Empleados
                    .FirstOrDefaultAsync(e =>
                        e.ApplicationUserId == dto.ApplicationUserId &&
                        e.Id != id);

                if (empleadoConUsuario != null)
                {
                    return BadRequest(new
                    {
                        mensaje =
                            "Este usuario ya está asociado a otro empleado."
                    });
                }
            }

            empleado.Nombre = dto.Nombre;
            empleado.Apellido = dto.Apellido;
            empleado.Cedula = dto.Cedula;
            empleado.Telefono = dto.Telefono;
            empleado.Email = dto.Email;
            empleado.ApplicationUserId = string.IsNullOrWhiteSpace(
                dto.ApplicationUserId)
                ? null
                : dto.ApplicationUserId;
            empleado.Activo = dto.Activo;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ==========================================
        // ELIMINAR EMPLEADO
        // SOLO ADMINISTRADOR
        // ==========================================

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmpleado(int id)
        {
            var empleado = await _context.Empleados
                .FindAsync(id);

            if (empleado == null)
            {
                return NotFound();
            }

            _context.Empleados.Remove(empleado);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("tecnicos")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<IEnumerable<Empleado>>> GetTecnicos(
    [FromServices] UserManager<ApplicationUser> userManager)
        {
            var usuariosTecnicos =
                await userManager.GetUsersInRoleAsync("Tecnico");

            var idsUsuariosTecnicos =
                usuariosTecnicos
                    .Select(u => u.Id)
                    .ToList();

            var tecnicos = await _context.Empleados
                .Where(e =>
                    e.ApplicationUserId != null &&
                    idsUsuariosTecnicos.Contains(e.ApplicationUserId))
                .ToListAsync();

            return Ok(tecnicos);
        }
    }
}