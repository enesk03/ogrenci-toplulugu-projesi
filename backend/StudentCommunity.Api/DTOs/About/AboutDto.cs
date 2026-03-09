/*namespace StudentCommunity.Api.DTOs.About;

public class AboutDto
{
    public string Content { get; set; }
}
*/
namespace StudentCommunity.Api.DTOs.About;

public class AboutDto
{
    public string Description { get; set; } = string.Empty;
    public string Mission { get; set; } = string.Empty;
    public string Vision { get; set; } = string.Empty;
}