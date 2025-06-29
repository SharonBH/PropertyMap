using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FSH.Starter.WebApi.Migrations.MSSQL.Catalog
{
    /// <inheritdoc />
    public partial class removedTenantfromalllookups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.DropIndex(
                name: "IX_Cities_TenantId_Name",
                schema: "catalog",
                table: "Cities");

            migrationBuilder.DropColumn(
                name: "TenantId",
                schema: "catalog",
                table: "PropertyTypes");

            migrationBuilder.DropColumn(
                name: "TenantId",
                schema: "catalog",
                table: "PropertyStatuses");

            migrationBuilder.DropColumn(
                name: "TenantId",
                schema: "catalog",
                table: "Neighborhoods");

            migrationBuilder.DropColumn(
                name: "TenantId",
                schema: "catalog",
                table: "Cities");

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

            migrationBuilder.CreateIndex(
                name: "IX_Cities_Name",
                schema: "catalog",
                table: "Cities",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.DropIndex(
                name: "IX_Cities_Name",
                schema: "catalog",
                table: "Cities");

            migrationBuilder.AddColumn<string>(
                name: "TenantId",
                schema: "catalog",
                table: "PropertyTypes",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TenantId",
                schema: "catalog",
                table: "PropertyStatuses",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TenantId",
                schema: "catalog",
                table: "Neighborhoods",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TenantId",
                schema: "catalog",
                table: "Cities",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

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

            migrationBuilder.CreateIndex(
                name: "IX_Cities_TenantId_Name",
                schema: "catalog",
                table: "Cities",
                columns: new[] { "TenantId", "Name" },
                unique: true);
        }
    }
}
