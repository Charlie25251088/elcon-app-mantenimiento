//using System.Text.Json.Serialization;

namespace ElconAppMantenimiento.Api.Models
{
    public class Mantenimiento
    {
        public int Id { get; set; }

        public int EquipoId { get; set; }

        public DateTime Fecha { get; set; }

        public string Tipo { get; set; } = "Preventivo";

        public string Descripcion { get; set; } = string.Empty;

        public string Estado { get; set; } = "Programado";

        public string Observaciones { get; set; } = string.Empty;

        public int? TecnicoId { get; set; }

        public Empleado? Tecnico { get; set; }

        //[JsonIgnore]
        public Equipo? Equipo { get; set; }
    }
}