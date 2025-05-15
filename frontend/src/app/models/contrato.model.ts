export interface Contrato {
    id: string;
    filial: Filial;
    operadora: string;
    plano: string;
    dataInicio: string;
    dataVencimento: string;
    valorMensal: number;
    status: 'Ativo' | 'Inativo';
}

export interface Filial {
    id: string;
    cnpj: string; // Formato: XX.XXX.XXX/XXXX-XX
    nome: string;
}