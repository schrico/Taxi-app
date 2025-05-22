export interface Viagem {
    _id?: string;
    motoristaId: any;
    taxiId: any;
    turnoId: any;
    pedidoId: any;
    numeroSequencia: number;
    inicio: {
      data: Date;
      morada: {
        rua: string;
        nmrPorta: number;
        codigoPostal: string;
        localidade: string;
        latitude: number;
        longitude: number;
      }
    };
    fim?: {
      data: Date;
      morada: {
        rua: string;
        nmrPorta: number;
        codigoPostal: string;
        localidade: string;
        latitude: number;
        longitude: number;
      }
    };
    nmrPessoas: number;
    quilometros?: number;
    precoTotal?: number;
    estado: "andamento" | "finalizada";
  }