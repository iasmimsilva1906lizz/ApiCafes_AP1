namespace ApiCafes.Dtos;

public class CafesDto
{
    public int id { get; set; }
    public string? nome { get; set; }
    public string? torra { get; set; }
    public bool disponivel { get; set; }
    public int quantidade { get; set; }
}