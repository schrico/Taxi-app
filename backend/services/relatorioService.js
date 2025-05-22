const Viagem = require('../models/viagem');

const getTotais = async (inicio, fim) => {
    const dataInicio = inicio ? new Date(inicio) : new Date();
    const dataFim = fim ? new Date(fim) : new Date();
    dataInicio.setHours(0,0,0,0);
    dataFim.setHours(23,59,59,999);

    const viagens = await Viagem.find({
        'inicio.data': { $gte: dataInicio, $lte: dataFim }
    });

    const totalViagens = viagens.length;
    const totalHoras = viagens.reduce((acc, v) => {
        if (v.fim && v.fim.data) {
            return acc + ((new Date(v.fim.data) - new Date(v.inicio.data)) / 3600000);
        }
        return acc;
    }, 0);
    const totalKm = viagens.reduce((acc, v) => acc + (v.quilometros || 0), 0);

    return { totalViagens, totalHoras, totalKm };
};

const getSubtotais = async (tipo, inicio, fim) => {
    const dataInicio = inicio ? new Date(inicio) : new Date();
    const dataFim = fim ? new Date(fim) : new Date();
    dataInicio.setHours(0,0,0,0);
    dataFim.setHours(23,59,59,999);

    const groupField = tipo === 'motorista' ? '$motoristaId' : '$taxiId';
    const lookupFrom = tipo === 'motorista' ? 'motoristas' : 'taxis';
    const lookupLocalField = tipo === 'motorista' ? 'motoristaId' : 'taxiId';
    const lookupForeignField = '_id';

    const subtotais = await Viagem.aggregate([
        { $match: { 'inicio.data': { $gte: dataInicio, $lte: dataFim } } },
        { $group: {
            _id: groupField,
            totalViagens: { $sum: 1 },
            totalHoras: { $sum: { $cond: [
                { $and: ['$fim.data', '$inicio.data'] },
                { $divide: [{ $subtract: ['$fim.data', '$inicio.data'] }, 3600000] },
                0
            ]}},
            totalKm: { $sum: '$quilometros' }
        }},
        {
            $lookup: {
                from: lookupFrom,
                localField: '_id',
                foreignField: lookupForeignField,
                as: 'info'
            }
        },
        { $unwind: { path: '$info', preserveNullAndEmptyArrays: true } },
        { $sort: { totalViagens: -1 } }
    ]);
    return subtotais;
};

const getDetalhes = async (tipo, id, inicio, fim) => {
    const dataInicio = inicio ? new Date(inicio) : new Date();
    const dataFim = fim ? new Date(fim) : new Date();
    dataInicio.setHours(0,0,0,0);
    dataFim.setHours(23,59,59,999);

    const match = { 'inicio.data': { $gte: dataInicio, $lte: dataFim } };
    if (tipo === 'motorista') match.motoristaId = id;
    if (tipo === 'taxi') match.taxiId = id;

    const viagens = await Viagem.find(match).sort({ 'inicio.data': -1 });
    return viagens;
};

module.exports = {
    getTotais,
    getSubtotais,
    getDetalhes
};