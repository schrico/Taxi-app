export interface Pedido {
  _id: string;
  cliente: string;
  origem: {
    rua: string;
    nmrPorta: number;
    codigoPostal: string;
    localidade: string;
    latitude?: number;
    longitude?: number;
  };
  destino: {
    rua: string;
    nmrPorta: number;
    codigoPostal: string;
    localidade: string;
    latitude?: number;
    longitude?: number;
  };
  conforto: 'Básico' | 'Luxuoso';
  nmrPessoas: number;
  estado: 'Pendente' | 'Concluído' | 'Aceite-Motorista' | 'Aceite-Cliente';
  dataPedido: string;
  motorista?: string;
}
