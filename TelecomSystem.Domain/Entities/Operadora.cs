using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace TelecomSystem.Domain.Entities;
public class Operadora
{
    public Guid Id { get; set; }
    public string Nome { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public TipoServico TipoServico { get; set; }
    public string ContatoSuporte { get; set; }
}

public enum TipoServico
{
    [EnumMember(Value = "Móvel")]
    Móvel,

    [EnumMember(Value = "Fixo")]
    Fixo,
    [EnumMember(Value = "Internet")]
    Internet
}