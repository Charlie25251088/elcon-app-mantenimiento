using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElconAppMantenimiento.Api.Migrations
{
    /// <inheritdoc />
    public partial class AgregarEmpleadosYRelaciones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TecnicoId",
                table: "Mantenimientos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ClienteId",
                table: "Equipos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Empleados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Cedula = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    ApplicationUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empleados", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Empleados_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Mantenimientos_TecnicoId",
                table: "Mantenimientos",
                column: "TecnicoId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipos_ClienteId",
                table: "Equipos",
                column: "ClienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Empleados_ApplicationUserId",
                table: "Empleados",
                column: "ApplicationUserId",
                unique: true,
                filter: "[ApplicationUserId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipos_Empleados_ClienteId",
                table: "Equipos",
                column: "ClienteId",
                principalTable: "Empleados",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Mantenimientos_Empleados_TecnicoId",
                table: "Mantenimientos",
                column: "TecnicoId",
                principalTable: "Empleados",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipos_Empleados_ClienteId",
                table: "Equipos");

            migrationBuilder.DropForeignKey(
                name: "FK_Mantenimientos_Empleados_TecnicoId",
                table: "Mantenimientos");

            migrationBuilder.DropTable(
                name: "Empleados");

            migrationBuilder.DropIndex(
                name: "IX_Mantenimientos_TecnicoId",
                table: "Mantenimientos");

            migrationBuilder.DropIndex(
                name: "IX_Equipos_ClienteId",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "TecnicoId",
                table: "Mantenimientos");

            migrationBuilder.DropColumn(
                name: "ClienteId",
                table: "Equipos");
        }
    }
}
