const viagemService = require('../services/viagemService');

exports.iniciarViagem = async (req, res) => {
    try {
        const viagem = await viagemService.iniciarViagem(req.body);
        res.status(201).json(viagem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.finalizarViagem = async (req, res) => {
    try {
        const viagem = await viagemService.finalizarViagem(req.params.viagemId);
        res.status(200).json(viagem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getViagensByMotorista = async (req, res) => {
    try {
        const viagens = await viagemService.getViagensByMotorista(req.params.motoristaId);
        res.status(200).json(viagens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getViagemAtiva = async (req, res) => {
    try {
        const viagem = await viagemService.getViagemAtiva(req.params.motoristaId);
        res.status(200).json(viagem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.listarViagensPorMotorista = async (req, res) => {
    try {
        const viagens = await viagemService.listarViagensPorMotorista(req.params.motoristaId);
        res.status(200).json(viagens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteViagens = async (req, res) => {
    try {
        await viagemService.deleteViagens();
        res.status(200).json({ message: "Todas as viagens foram apagadas" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};