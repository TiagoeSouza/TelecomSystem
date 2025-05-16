import { IFilial } from "./filial.model";
import { IOperadora } from "./operadora.model";

export interface IContrato {
    id: string;
    filialId: string;
    filial: IFilial;
    operadoraId: string;
    operadora: IOperadora;
    planoContratado: string;
    dataInicio: string;
    dataVencimento: string;
    valorMensal: number;
    status: 'A' | 'I';
}