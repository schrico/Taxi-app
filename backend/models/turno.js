const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TurnoSchema = new Schema({
  motoristaId: { type: Schema.Types.ObjectId, ref: 'Motorista', required: true },
  taxiId: { type: Schema.Types.ObjectId, ref: 'Taxi', required: true },
  inicio: { type: Date, required: true },
  fim: { type: Date, required: true }
});

TurnoSchema.index({ motoristaId: 1, inicio: 1, fim: 1 }, { unique: true });

module.exports = mongoose.model('Turno', TurnoSchema);