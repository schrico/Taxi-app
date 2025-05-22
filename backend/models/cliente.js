const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
    nome: { type: String, required: true },
    nif: { 
        type: Number, 
        required: true,
        validate: {
            validator: function(nif) {
                return /^[0-9]{9}$/.test(nif.toString()) && nif > 0;
            },
            message: 'NIF deve ter 9 dígitos e ser positivo'
        }
    },
    genero: { 
        type: String, 
        required: true,
        enum: ['masculino', 'feminino'],
        message: 'Género deve ser masculino ou feminino'
    },
});

module.exports = mongoose.model('Cliente', ClienteSchema);
