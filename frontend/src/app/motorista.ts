export interface Motorista {
    _id: string;
    nome: string;
    anoNascimento: number;
    nif: number;
    genero: 'masculino' | 'feminino';
    nmrCartaConducao: number;
    morada: {
        ID: number;
        rua: string;
        nmrPorta: number;
        codigoPostal: string;
        Localidade: string;
    };
}
