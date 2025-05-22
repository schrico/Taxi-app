export interface Turno {
    _id?: string;
    motoristaId: string;
    taxiId: {
      _id: string;
      marca?: string;
      modelo?: string;
    };
    inicio: Date;
    fim: Date;
  }