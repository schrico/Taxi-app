const Servico = require('../models/servico');
const servicoService = require('../services/servicoService');

const createServico = async (req, res) => {
    try {
        const servico = await servicoService.createServico(req.body);
        res.status(201).json(servico);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getServicos = async (req, res) => {
    try {
        const servicos = await servicoService.getServicos();
        res.status(200).json(servicos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getServico = async (req, res) => {
    try {
        const servico = await servicoService.getServico(req.params.id);
        if (servico) {
            res.status(200).json(servico);
        } else {
            res.status(404).json({ message: 'Serviço not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const servico_init = async (req, res) => {
    try {
        await Servico.deleteMany({});
        res.status(200).json({ message: "All serviços have been deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createServico,
    getServicos,
    getServico,
    servico_init
};