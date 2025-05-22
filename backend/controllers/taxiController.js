const taxiService = require('../services/taxiService');

const taxi_init = async (req, res) => {
    // Exemplo: apaga todos os táxis
    try {
        await require('../models/taxi').deleteMany({});
        res.status(200).json({ message: "Todos os táxis foram apagados" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createTaxi = async (req, res) => {
    try {
        const taxi = await taxiService.createTaxi(req.body);
        res.status(201).json(taxi);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTaxis = async (req, res) => {
    try {
        const taxis = await taxiService.getTaxis();
        res.status(200).json(taxis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTaxi = async (req, res) => {
    try {
        const taxi = await taxiService.getTaxi(req.params.id);
        if (taxi) res.status(200).json(taxi);
        else res.status(404).json({ message: "Taxi não encontrado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTaxi = async (req, res) => {
    try {
        const updatedTaxi = await taxiService.updateTaxi(req.params.id, req.body);
        res.status(200).json(updatedTaxi);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTaxi = async (req, res) => {
    try {
        const result = await taxiService.deleteTaxi(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createTaxi,
    getTaxis,
    getTaxi,
    updateTaxi,
    deleteTaxi,
    taxi_init
};