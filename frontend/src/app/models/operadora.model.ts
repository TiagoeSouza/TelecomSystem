export interface Operadora {
    id: string;
    nome: string;
    tipoServico: 'Móvel' | 'Fixo' | 'Internet';
    contato: string;

}

// Utilitário opcional para gerar GUID
export function generateGUID() {
    return crypto.randomUUID();
}
