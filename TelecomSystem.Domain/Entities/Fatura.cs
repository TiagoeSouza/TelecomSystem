namespace TelecomSystem.Domain.Entities;
public class Fatura
{
    public Guid Id { get; set; }
    public Guid ContratoId { get; set; }
    public Contrato Contrato { get; set; }
    public DateTime DataEmissao { get; set; }
    public DateTime DataVencimento { get; set; }
    public decimal ValorCobrado { get; set; }
    public StatusFatura Status { get; set; }
}


public enum StatusFatura
{
    Paga,
    Pendente,
    Atrasada
}