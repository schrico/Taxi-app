const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MotoristaSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    anoNascimento: { 
        type: Number, 
        required: true,
        validate: {
            validator: function(ano) {
                const anoAtual = new Date().getFullYear();
                return ano <= (anoAtual - 18);
            },
            message: 'O motorista deve ter pelo menos 18 anos'
        }
    },
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
    nmrCartaConducao: { 
        type: Number, 
        required: true,
        unique: true
    },
    morada: {
        rua: { 
            type: String, 
            required: true 
        },
        nmrPorta: { 
            type: Number, 
            required: true 
        },
        codigoPostal: { 
            type: String, 
            required: true,
            validate: {
                validator: function(cp) {
                    return /^\d{4}-\d{3}$/.test(cp);
                },
                message: 'Código postal deve estar no formato XXXX-XXX'
            }
        },
        Localidade: { 
            type: String
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Motorista', MotoristaSchema);
