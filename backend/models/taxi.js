const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaxiSchema = new Schema({
    modelo: { type: String, required: true },
    marca: { type: String, required: true },
    matricula: { 
        type: String, 
        required: true,
        uppercase: true,
        validate: {
            validator: function(matricula) {
                const matriculaRegex = /^([A-Z]{2}\d{2}[A-Z]{2}|\d{2}[A-Z]{2}\d{2}|\d{4}[A-Z]{2}|[A-Z]{2}\d{4})$/;
                return matriculaRegex.test(matricula);
            },
            message: 'Matrícula inválida. Formatos aceites: AA01AA, 01AA01, 0101AA ou AA0101'
        }
    },
    anoCompra: { 
        type: Number, 
        required: true,
        max: [new Date().getFullYear(), 
            'O ano de compra não pode ser superior ao ano atual']
    },
    conforto: { 
        type: String, 
        required: true,
        enum: ['Básico', 'Luxuoso'],
        message: 'O conforto deve ser Básico ou Luxuoso'
    },
}, { timestamps: true });

TaxiSchema.virtual("url").get(function () {
    return `/taxis/${this._id}`;
});

module.exports = mongoose.model('Taxi', TaxiSchema);

