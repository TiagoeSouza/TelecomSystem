namespace TelecomSystem.Domain.Entities;
public class Operadora
{
    public Guid Id { get; set; }
    public string Nome { get; set; }
    public TipoServico TipoServico { get; set; }
    public string ContatoSuporte { get; set; }
}

public enum TipoServico
{
    Móvel,
    Fixo,
    Internet
}