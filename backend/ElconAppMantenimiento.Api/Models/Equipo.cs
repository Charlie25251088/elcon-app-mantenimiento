namespace ElconAppMantenimiento.Api.Models
{
    public class Equipo
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Codigo { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public bool Activo { get; set; } = true;

        // Cliente responsable del equipo
        public int? ClienteId { get; set; }

        public Empleado? Cliente { get; set; }

        public ICollection<Mantenimiento> Mantenimientos { get; set; }
            = new List<Mantenimiento>();
    }
}