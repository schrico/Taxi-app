const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServicoSchema = new Schema({
    ppmBasico: {
        type: Number,
        required: true,
        min: [0, 'O preço não pode ser negativo'],
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: props => `${props.value} não é um preço válido!`
        }
    },

    ppmLuxuoso: {
        type: Number,
        required: true,
        min: [0, 'O preço não pode ser negativo'],
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: props => `${props.value} não é um preço válido!`
        }
    },

    acrescimoNoturno: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Servico', ServicoSchema);