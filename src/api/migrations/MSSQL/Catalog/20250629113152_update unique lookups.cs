using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FSH.Starter.WebApi.Migrations.MSSQL.Catalog
{
    /// <inheritdoc />
    public partial class updateuniquelookups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Regions_Name",
                schema: "catalog",
                table: "Regions");

            migrationBuilder.DropIndex(
                name: "IX_PropertyTypes_Name",
                schema: "catalog",
                table: "PropertyTypes");

            migrationBuilder.DropIndex(
                name: "IX_PropertyStatuses_Name",
                schema: "catalog",
                table: "PropertyStatuses");

            migrationBuilder.DropIndex(
                name: "IX_Neighborhoods_Name",
                schema: "catalog",
                table: "Neighborhoods");

            migrationBuilder.CreateIndex(
                name: "IX_Regions_TenantId_Name",
                schema: "catalog",
                table: "Regions",
                columns: new[] { "TenantId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyTypes_TenantId_Name",
                schema: "catalog",
                table: "PropertyTypes",
                columns: new[] { "TenantId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyStatuses_TenantId_Name",
                schema: "catalog",
                table: "PropertyStatuses",
                columns: new[] { "TenantId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Neighborhoods_TenantId_Name",
                schema: "catalog",
                table: "Neighborhoods",
                columns: new[] { "TenantId", "Name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Regions_TenantId_Name",
                schema: "catalog",
                table: "Regions");

            migrationBuilder.DropIndex(
                name: "IX_PropertyTypes_TenantId_Name",
                schema: "catalog",
                table: "PropertyTypes");

            migrationBuilder.DropIndex(
                name: "IX_PropertyStatuses_TenantId_Name",
                schema: "catalog",
                table: "PropertyStatuses");

            migrationBuilder.DropIndex(
                name: "IX_Neighborhoods_TenantId_Name",
                schema: "catalog",
                table: "Neighborhoods");

            migrationBuilder.CreateIndex(
                name: "IX_Regions_Name",
                schema: "catalog",
                table: "Regions",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyTypes_Name",
                schema: "catalog",
                table: "PropertyTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyStatuses_Name",
                schema: "catalog",
                table: "PropertyStatuses",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Neighborhoods_Name",
                schema: "catalog",
                table: "Neighborhoods",
                column: "Name",
                unique: true);
        }
    }
}
