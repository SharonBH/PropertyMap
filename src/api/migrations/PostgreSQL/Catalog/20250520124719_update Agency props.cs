using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FSH.Starter.WebApi.Migrations.PostgreSQL.Catalog
{
    /// <inheritdoc />
    public partial class updateAgencyprops : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdditionalInfo",
                schema: "catalog",
                table: "Agencies",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LogoURL",
                schema: "catalog",
                table: "Agencies",
                type: "character varying(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PrimaryColor",
                schema: "catalog",
                table: "Agencies",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalInfo",
                schema: "catalog",
                table: "Agencies");

            migrationBuilder.DropColumn(
                name: "LogoURL",
                schema: "catalog",
                table: "Agencies");

            migrationBuilder.DropColumn(
                name: "PrimaryColor",
                schema: "catalog",
                table: "Agencies");
        }
    }
}
