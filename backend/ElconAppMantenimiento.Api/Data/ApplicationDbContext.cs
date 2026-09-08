using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ElconAppMantenimiento.Api.Models;

namespace ElconAppMantenimiento.Api.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Empleado> Empleados { get; set; }

        public DbSet<Equipo> Equipos { get; set; }

        public DbSet<Mantenimiento> Mantenimientos { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ApplicationUser -> Empleado
            modelBuilder.Entity<Empleado>()
                .HasOne(e => e.ApplicationUser)
                .WithOne()
                .HasForeignKey<Empleado>(e => e.ApplicationUserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Cliente -> Equipos
            modelBuilder.Entity<Equipo>()
                .HasOne(e => e.Cliente)
                .WithMany()
                .HasForeignKey(e => e.ClienteId)
                .OnDelete(DeleteBehavior.SetNull);

            // Técnico -> Mantenimientos
            modelBuilder.Entity<Mantenimiento>()
                .HasOne(m => m.Tecnico)
                .WithMany(e => e.Mantenimientos)
                .HasForeignKey(m => m.TecnicoId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}


