export interface IOperadora {
    id: string;
    nome: string;
    tipoServico: 'Móvel' | 'Fixo' | 'Internet';
    contatoSuporte: string;

}