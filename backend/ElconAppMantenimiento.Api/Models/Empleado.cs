namespace ElconAppMantenimiento.Api.Models
{
    public class Empleado
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Apellido { get; set; } = string.Empty;

        public string Cedula { get; set; } = string.Empty;

        public string Telefono { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public bool Activo { get; set; } = true;

        public string? ApplicationUserId { get; set; }

        public ApplicationUser? ApplicationUser { get; set; }

        public ICollection<Mantenimiento> Mantenimientos { get; set; }
            = new List<Mantenimiento>();
    }
}