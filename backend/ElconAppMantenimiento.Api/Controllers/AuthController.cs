using ElconAppMantenimiento.Api.Data;
using ElconAppMantenimiento.Api.DTOs;
using ElconAppMantenimiento.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ElconAppMantenimiento.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
        }

        // ==========================================
        // REGISTRO DE USUARIO
        // TODO REGISTRO PÚBLICO ES CLIENTE
        // ==========================================

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            var usuarioExistente = await _userManager
                .FindByEmailAsync(model.Email);

            if (usuarioExistente != null)
            {
                return BadRequest(new
                {
                    mensaje = "El correo electrónico ya está registrado."
                });
            }

            var usuario = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email
            };

            var resultado = await _userManager.CreateAsync(
                usuario,
                model.Password
            );

            if (!resultado.Succeeded)
            {
                return BadRequest(resultado.Errors);
            }

            // Todo usuario registrado públicamente
            // comienza como Cliente.
            var resultadoRol = await _userManager.AddToRoleAsync(
                usuario,
                "Cliente"
            );

            if (!resultadoRol.Succeeded)
            {
                return BadRequest(resultadoRol.Errors);
            }

            return Ok(new
            {
                mensaje = "Usuario registrado correctamente.",
                email = usuario.Email,
                rol = "Cliente"
            });
        }

        // ==========================================
        // LOGIN
        // ==========================================

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            var usuario = await _userManager
                .FindByEmailAsync(model.Email);

            if (usuario == null)
            {
                return Unauthorized(new
                {
                    mensaje = "Correo o contraseña incorrectos."
                });
            }

            var passwordCorrecta = await _userManager
                .CheckPasswordAsync(
                    usuario,
                    model.Password
                );

            if (!passwordCorrecta)
            {
                return Unauthorized(new
                {
                    mensaje = "Correo o contraseña incorrectos."
                });
            }

            var roles = await _userManager
                .GetRolesAsync(usuario);

            var token = GenerarToken(
                usuario,
                roles
            );

            return Ok(new
            {
                mensaje = "Inicio de sesión exitoso.",
                token = token,
                email = usuario.Email,
                roles = roles
            });
        }

        // ==========================================
        // PERFIL DEL USUARIO AUTENTICADO
        // ==========================================

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> MiPerfil()
        {
            var userId = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (userId == null)
            {
                return Unauthorized();
            }

            var usuario = await _userManager
                .FindByIdAsync(userId);

            if (usuario == null)
            {
                return NotFound();
            }

            var roles = await _userManager
                .GetRolesAsync(usuario);

            var empleado = await _context.Empleados
                .FirstOrDefaultAsync(
                    e => e.ApplicationUserId == usuario.Id
                );

            return Ok(new
            {
                id = usuario.Id,
                email = usuario.Email,
                roles = roles,

                empleado = empleado == null
                    ? null
                    : new
                    {
                        id = empleado.Id,
                        nombre = empleado.Nombre,
                        apellido = empleado.Apellido,
                        cedula = empleado.Cedula,
                        telefono = empleado.Telefono,
                        activo = empleado.Activo
                    }
            });
        }

        // ==========================================
        // ASIGNAR ROL TÉCNICO
        // SOLO ADMINISTRADOR
        // ==========================================

        [Authorize(Roles = "Administrador")]
        [HttpPost("asignar-tecnico/{userId}")]
        public async Task<IActionResult> AsignarTecnico(string userId)
        {
            var usuario = await _userManager.FindByIdAsync(userId);

            if (usuario == null)
            {
                return NotFound(new
                {
                    mensaje = "El usuario no existe."
                });
            }

            var rolesActuales = await _userManager
                .GetRolesAsync(usuario);

            if (rolesActuales.Contains("Administrador"))
            {
                return BadRequest(new
                {
                    mensaje = "No se puede cambiar el rol de un Administrador."
                });
            }

            if (rolesActuales.Contains("Tecnico"))
            {
                return BadRequest(new
                {
                    mensaje = "El usuario ya tiene el rol Técnico."
                });
            }

            // El usuario actualmente es Cliente.
            // Lo quitamos de Cliente.
            if (rolesActuales.Contains("Cliente"))
            {
                var quitarCliente = await _userManager
                    .RemoveFromRoleAsync(usuario, "Cliente");

                if (!quitarCliente.Succeeded)
                {
                    return BadRequest(quitarCliente.Errors);
                }
            }

            // Asignamos Técnico.
            var agregarTecnico = await _userManager
                .AddToRoleAsync(usuario, "Tecnico");

            if (!agregarTecnico.Succeeded)
            {
                return BadRequest(agregarTecnico.Errors);
            }

            return Ok(new
            {
                mensaje = "Rol Técnico asignado correctamente.",
                email = usuario.Email,
                rol = "Tecnico"
            });
        }

        // ==========================================
        // GENERAR JWT
        // ==========================================

        private string GenerarToken(
            ApplicationUser usuario,
            IList<string> roles)
        {
            var jwtKey = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException(
                    "Jwt:Key no está configurada."
                );

            var jwtIssuer = _configuration["Jwt:Issuer"]
                ?? throw new InvalidOperationException(
                    "Jwt:Issuer no está configurado."
                );

            var jwtAudience = _configuration["Jwt:Audience"]
                ?? throw new InvalidOperationException(
                    "Jwt:Audience no está configurada."
                );

            var claims = new List<Claim>
            {
                new Claim(
                    JwtRegisteredClaimNames.Sub,
                    usuario.Id
                ),

                new Claim(
                    JwtRegisteredClaimNames.Email,
                    usuario.Email ?? ""
                ),

                new Claim(
                    ClaimTypes.Name,
                    usuario.Email ?? ""
                )
            };

            foreach (var rol in roles)
            {
                claims.Add(
                    new Claim(
                        ClaimTypes.Role,
                        rol
                    )
                );
            }

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}