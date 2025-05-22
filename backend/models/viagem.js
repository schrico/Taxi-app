const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ViagemSchema = new Schema({
    turnoId: { type: Schema.Types.ObjectId, ref: 'Turno', required: true },
    pedidoId: { type: Schema.Types.ObjectId, ref: 'pedido', required: true },
    motoristaId: { type: Schema.Types.ObjectId, ref: 'Motorista', required: true },
    taxiId: { type: Schema.Types.ObjectId, ref: 'taxi', required: true },
    numeroSequencia: { type: Number, required: true },
    inicio: {
        data: { type: Date, required: true },
        morada: {
            rua: { type: String, required: true },
            nmrPorta: { type: Number, required: true },
            codigoPostal: { type: String, required: true },
            localidade: { type: String },
            latitude: { type: Number },
            longitude: { type: Number }
        }
    },
    fim: {
        data: { type: Date },
        morada: {
            rua: { type: String },
            nmrPorta: { type: Number },
            codigoPostal: { type: String },
            localidade: { type: String },
            latitude: { type: Number },
            longitude: { type: Number }
        }
    },
    nmrPessoas: { type: Number, required: true, min: 1 },
    quilometros: { type: Number },
    precoTotal: { type: Number },
    estado: {type: String, enum:['andamento', 'finalizada'], default: 'andamento'}
});

module.exports = mongoose.model('Viagem', ViagemSchema);
