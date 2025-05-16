using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TelecomSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AjustarDeleteBehaviorGlobal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contratos_Filiais_FilialId",
                table: "Contratos");

            migrationBuilder.DropForeignKey(
                name: "FK_Contratos_Operadoras_OperadoraId",
                table: "Contratos");

            migrationBuilder.DropForeignKey(
                name: "FK_Faturas_Contratos_ContratoId",
                table: "Faturas");

            migrationBuilder.AddForeignKey(
                name: "FK_Contratos_Filiais_FilialId",
                table: "Contratos",
                column: "FilialId",
                principalTable: "Filiais",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Contratos_Operadoras_OperadoraId",
                table: "Contratos",
                column: "OperadoraId",
                principalTable: "Operadoras",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Faturas_Contratos_ContratoId",
                table: "Faturas",
                column: "ContratoId",
                principalTable: "Contratos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contratos_Filiais_FilialId",
                table: "Contratos");

            migrationBuilder.DropForeignKey(
                name: "FK_Contratos_Operadoras_OperadoraId",
                table: "Contratos");

            migrationBuilder.DropForeignKey(
                name: "FK_Faturas_Contratos_ContratoId",
                table: "Faturas");

            migrationBuilder.AddForeignKey(
                name: "FK_Contratos_Filiais_FilialId",
                table: "Contratos",
                column: "FilialId",
                principalTable: "Filiais",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Contratos_Operadoras_OperadoraId",
                table: "Contratos",
                column: "OperadoraId",
                principalTable: "Operadoras",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Faturas_Contratos_ContratoId",
                table: "Faturas",
                column: "ContratoId",
                principalTable: "Contratos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
