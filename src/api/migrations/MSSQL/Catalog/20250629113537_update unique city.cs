using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FSH.Starter.WebApi.Migrations.MSSQL.Catalog
{
    /// <inheritdoc />
    public partial class updateuniquecity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Cities_Name",
                schema: "catalog",
                table: "Cities");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_TenantId_Name",
                schema: "catalog",
                table: "Cities",
                columns: new[] { "TenantId", "Name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Cities_TenantId_Name",
                schema: "catalog",
                table: "Cities");

            migrationBuilder.CreateIndex(
                name: "IX_Cities_Name",
                schema: "catalog",
                table: "Cities",
                column: "Name",
                unique: true);
        }
    }
}
