using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FSH.Starter.WebApi.Migrations.PostgreSQL.Catalog
{
    /// <inheritdoc />
    public partial class updatePropertiesSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AgencyId",
                schema: "catalog",
                table: "Properties",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Properties_AgencyId",
                schema: "catalog",
                table: "Properties",
                column: "AgencyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_Agencies_AgencyId",
                schema: "catalog",
                table: "Properties",
                column: "AgencyId",
                principalSchema: "catalog",
                principalTable: "Agencies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Properties_Agencies_AgencyId",
                schema: "catalog",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Properties_AgencyId",
                schema: "catalog",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "AgencyId",
                schema: "catalog",
                table: "Properties");
        }
    }
}
