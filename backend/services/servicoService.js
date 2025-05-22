const Servico = require('../models/servico');

const createServico = async (servicoData) => {
    try {
        const servico = new Servico(servicoData);
        return await servico.save();
    } catch (error) {
        throw error;
    }
};

const getServicos = async () => {
    return await Servico.find();
};

const getServico = async (id) => {
    return await Servico.findById(id);
};

module.exports = {
    createServico,
    getServicos,
    getServico
};