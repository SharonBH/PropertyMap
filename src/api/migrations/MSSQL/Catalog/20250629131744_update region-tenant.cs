using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FSH.Starter.WebApi.Migrations.MSSQL.Catalog
{
    /// <inheritdoc />
    public partial class updateregiontenant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Regions_TenantId_Name",
                schema: "catalog",
                table: "Regions");

            migrationBuilder.DropColumn(
                name: "TenantId",
                schema: "catalog",
                table: "Regions");

            migrationBuilder.CreateIndex(
                name: "IX_Regions_Name",
                schema: "catalog",
                table: "Regions",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Regions_Name",
                schema: "catalog",
                table: "Regions");

            migrationBuilder.AddColumn<string>(
                name: "TenantId",
                schema: "catalog",
                table: "Regions",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Regions_TenantId_Name",
                schema: "catalog",
                table: "Regions",
                columns: new[] { "TenantId", "Name" },
                unique: true);
        }
    }
}
