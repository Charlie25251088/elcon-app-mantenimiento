namespace ElconAppMantenimiento.Api.DTOs
{
    public class EmpleadoDto
    {
        public string Nombre { get; set; } = string.Empty;

        public string Apellido { get; set; } = string.Empty;

        public string Cedula { get; set; } = string.Empty;

        public string Telefono { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? ApplicationUserId { get; set; }

        public bool Activo { get; set; } = true;
    }
}