const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    origem: {
        rua: { type: String, required: true },
        nmrPorta: { type: Number, required: true },
        codigoPostal: { type: String, required: true },
        localidade: { type: String },
        latitude: { type: Number },
        longitude: { type: Number }
    },
    destino: {
        rua: { type: String, required: true },
        nmrPorta: { type: Number, required: true },
        codigoPostal: { type: String, required: true },
        localidade: { type: String },
        latitude: { type: Number },
        longitude: { type: Number }
    },
    conforto: { 
        type: String, 
        required: true,
        enum: ['Básico', 'Luxuoso'],
        message: 'O conforto deve ser Básico ou Luxuoso'
    },
    nmrPessoas: { 
        type: Number, 
        required: true,
        min: [1, 'Deve haver pelo menos uma pessoa na viagem']
    },
    dataPedido: { type: Date, default: Date.now },
    estado: { 
        type: String, 
        required: true,
        enum: ['Pendente', 'Concluído', 'Aceite-Motorista', 'Aceite-Cliente'],
        default: 'Pendente'
    },
    motoristaId: { type: Schema.Types.ObjectId, ref: 'Motorista', required: false },
    tempoEstimado: { type: Number }
});

module.exports = mongoose.model('pedido', pedidoSchema);
