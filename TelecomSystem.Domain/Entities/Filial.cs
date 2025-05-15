namespace TelecomSystem.Domain.Entities;
public class Filial
{
    public Guid Id { get; set; }
    public string Nome { get; set; }

    public string Cnpj { get; set; }

    // TODO: Futuramente poderia implementar outras propredades conforme necessidade
}
