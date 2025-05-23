﻿namespace TelecomSystem.Domain.Entities;

public class Contrato
{
    public Guid Id { get; set; }

    public Guid FilialId { get; set; }
    public Filial Filial { get; set; }
    public Guid OperadoraId { get; set; }
    public Operadora Operadora { get; set; }
    public string PlanoContratado { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataVencimento { get; set; }
    public decimal ValorMensal { get; set; }
    public char Status { get; set; }
}
