import { enumConforto } from './enum-conforto';

export interface Taxi {
    _id: string;
    modelo: string;
    marca: string;
    matricula: string;
    anoCompra: number;
    conforto: enumConforto;
}

