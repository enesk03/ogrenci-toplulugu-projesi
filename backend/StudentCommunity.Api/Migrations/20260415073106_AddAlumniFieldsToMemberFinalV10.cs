using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCommunity.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAlumniFieldsToMemberFinalV10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Members",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "GraduationNote",
                table: "Members",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsGraduated",
                table: "Members",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Projects",
                table: "Members",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "GraduationNote",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "IsGraduated",
                table: "Members");

            migrationBuilder.DropColumn(
                name: "Projects",
                table: "Members");
        }
    }
}
