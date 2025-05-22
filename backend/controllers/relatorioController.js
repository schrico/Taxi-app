const relatorioService = require('../services/relatorioService');

const getTotais = async (req, res) => {
    try {
        const { inicio, fim } = req.query;
        const totais = await relatorioService.getTotais(inicio, fim);
        res.status(200).json(totais);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSubtotais = async (req, res) => {
    try {
        const { tipo, inicio, fim } = req.query;
        const subtotais = await relatorioService.getSubtotais(tipo, inicio, fim);
        res.status(200).json(subtotais);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDetalhes = async (req, res) => {
    try {
        const { tipo, id, inicio, fim } = req.query;
        const detalhes = await relatorioService.getDetalhes(tipo, id, inicio, fim);
        res.status(200).json(detalhes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTotais,
    getSubtotais,
    getDetalhes
};