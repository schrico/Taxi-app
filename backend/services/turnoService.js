const Turno = require('../models/turno');
const Taxi = require('../models/taxi');


// Criar um turno
exports.createTurno = async (turnoData) => {
  const { motoristaId, taxiId, inicio, fim } = turnoData;

  // Validações
  if (!motoristaId || !taxiId || !inicio || !fim) {
    throw new Error('Todos os campos são obrigatórios.');
  }

  const inicioDate = new Date(inicio);
  const fimDate = new Date(fim);
  const agora = new Date();

  if (isNaN(inicioDate) || isNaN(fimDate)) {
    throw new Error('Datas inválidas.');
  }

  if (inicioDate >= fimDate) {
    throw new Error('O início do turno deve ser antes do fim.');
  }

  if (inicioDate <= agora) {
    throw new Error('O início do turno deve ser depois da hora atual.');
  }

  const duracao = (fimDate - inicioDate) / (1000 * 60 * 60); // Duração em horas
  if (duracao > 8) {
    throw new Error('A duração do turno não pode ser superior a 8 horas.');
  }

  // Verificar sobreposição de turnos
  const overlappingTurnos = await Turno.find({
    $or: [
      { motoristaId, inicio: { $lt: fimDate }, fim: { $gt: inicioDate } },
      { taxiId, inicio: { $lt: fimDate }, fim: { $gt: inicioDate } }
    ]
  });

  if (overlappingTurnos.length > 0) {
    throw new Error('O turno interseta outro turno existente.');
  }

  const turno = new Turno({ motoristaId, taxiId, inicio: inicioDate, fim: fimDate });
  await turno.save();
  return turno;
};

exports.getAvailableTaxis = async (inicio, fim) => {
  const inicioDate = new Date(inicio);
  const fimDate = new Date(fim);

  if (isNaN(inicioDate) || isNaN(fimDate)) {
    throw new Error('Datas inválidas.');
  }

  const unavailableTaxis = await Turno.find({
    inicio: { $lt: fimDate },
    fim: { $gt: inicioDate }
  }).distinct('taxiId');

  return await Taxi.find({ _id: { $nin: unavailableTaxis } });
};

// Listar turnos do motorista
exports.getTurnosByMotorista = async (motoristaId) => {
  if (!motoristaId) {
    throw new Error('O ID do motorista é obrigatório.');
  }

  return await Turno.find({ motoristaId })
    .populate('taxiId', 'marca modelo')
    .sort({ inicio: 1 });
};

exports.getTurnoAtivo = async (motoristaId) => {
  if (!motoristaId) {
    throw new Error('O ID do motorista é obrigatório.');
  }

  const agora = new Date();

  const turnoAtivo = await Turno.findOne({
    motoristaId,
    inicio: { $lte: agora },
    fim: { $gte: agora }
  }).populate('taxiId', 'marca modelo');

  return turnoAtivo;
};

exports.isTurnoAtivo = async (motoristaId) => {
  if (!motoristaId) {
    throw new Error('O ID do motorista é obrigatório.');
  }

  const agora = new Date();

  const turnoAtivo = await Turno.findOne({
    motoristaId,
    inicio: { $lte: agora },
    fim: { $gte: agora }
  });

  return !!turnoAtivo; // Retorna true se existe um turno ativo, false caso contrário
}
