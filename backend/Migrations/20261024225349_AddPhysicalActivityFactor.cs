using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlateBalance.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPhysicalActivityFactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "PhysicalActivityFactor",
                table: "AspNetUsers",
                type: "real",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhysicalActivityFactor",
                table: "AspNetUsers");
        }
    }
}
