import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function generateGUID() {
    return crypto.randomUUID();
}

export function validarCnpj(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const cnpj = (control.value || '').replace(/\D/g, '');

        if (cnpj.length !== 14) return { cnpjInvalido: true };

        // Validação matemática do CNPJ
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += +numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== +digitos.charAt(0)) return { cnpjInvalido: true };

        tamanho += 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += +numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== +digitos.charAt(1)) return { cnpjInvalido: true };

        return null; // CNPJ válido
    };
}
