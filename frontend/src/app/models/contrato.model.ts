export interface Contrato {
    id: string;
    filialId: string;
    filialName: string;
    operadora: string;
    plano: string;
    dataInicio: string;
    dataVencimento: string;
    valorMensal: number;
    status: 'Ativo' | 'Inativo';
}