const Taxi = require('../models/taxi');
const Turno = require('../models/turno');
const Viagem = require('../models/viagem');


const createTaxi = async (taxiData) => {
    const taxi = new Taxi(taxiData);
    const validationError = taxi.validateSync();
    if (validationError) throw validationError;
    return await taxi.save();
};

const getTaxis = async () => {
    return await Taxi.find().sort({ updatedAt: -1 });
};

const getTaxi = async (id) => {
    return await Taxi.findById(id);
};

const updateTaxi = async (id, updateData) => {
    const taxi = await Taxi.findById(id);
    if (!taxi) throw new Error('Taxi não encontrado');

    // Só permite editar conforto se não houver viagens
    const viagens = await Viagem.find({ taxiId: id });

    if (
        updateData.conforto !== undefined &&
        viagens.length > 0 &&
        updateData.conforto !== taxi.conforto
    ) {
        throw new Error('Não é possível alterar o conforto após o táxi ter viagens');
    }

    Object.keys(updateData).forEach(key => {
        taxi[key] = updateData[key];
    });

    const validationError = taxi.validateSync();
    if (validationError) throw validationError;

    return await taxi.save();
};

const deleteTaxi = async (id) => {
    // Só permite remover se nunca teve turnos
    const turnos = await Turno.find({ taxiId: id });
    if (turnos.length > 0) {
        throw new Error('Não é possível remover táxi com turnos associados');
    }

    await Taxi.findByIdAndDelete(id);
    return { message: 'Táxi removido com sucesso' };
};

module.exports = {
    createTaxi,
    getTaxis,
    getTaxi,
    updateTaxi,
    deleteTaxi
};