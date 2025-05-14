export interface Fatura {
    id: string;
    contratoId: string;
    dataEmissao: string;
    dataVencimento: string;
    valorCobrado: number;
    status: 'Paga' | 'Pendente' | 'Atrasada';
}