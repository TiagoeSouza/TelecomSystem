import { IContrato } from "./contrato.model";

export interface IFatura {
    id: string;
    contratoId: string;
    contrato: IContrato;
    dataEmissao: string;
    dataVencimento: string;
    valorCobrado: number;
    status: 'Paga' | 'Pendente' | 'Atrasada';
}