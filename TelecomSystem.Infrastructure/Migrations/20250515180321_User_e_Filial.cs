using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TelecomSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class User_e_Filial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contratos_Filial_FilialId",
                table: "Contratos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Filial",
                table: "Filial");

            migrationBuilder.RenameTable(
                name: "Filial",
                newName: "Filiais");

            migrationBuilder.AddColumn<string>(
                name: "Cnpj",
                table: "Filiais",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Filiais",
                table: "Filiais",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "UserAuths",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserEmail = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAuths", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Contratos_Filiais_FilialId",
                table: "Contratos",
                column: "FilialId",
                principalTable: "Filiais",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contratos_Filiais_FilialId",
                table: "Contratos");

            migrationBuilder.DropTable(
                name: "UserAuths");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Filiais",
                table: "Filiais");

            migrationBuilder.DropColumn(
                name: "Cnpj",
                table: "Filiais");

            migrationBuilder.RenameTable(
                name: "Filiais",
                newName: "Filial");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Filial",
                table: "Filial",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contratos_Filial_FilialId",
                table: "Contratos",
                column: "FilialId",
                principalTable: "Filial",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
