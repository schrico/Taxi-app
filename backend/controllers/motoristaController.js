const Motorista = require('../models/motorista');
const motoristaService = require('../services/motoristaService');

const createMotorista = async (req, res) => {
    try {
        const motorista = await motoristaService.createMotorista(req.body);
        res.status(201).json(motorista);
    } catch (error) {
        console.error('Error creating motorista:', error);
        res.status(400).json({ 
            message: error.message,
            details: error.errors ? Object.values(error.errors).map(e => e.message) : undefined
        });
    }
};

const getMotoristas = async (req, res) => {
    try {
        const motoristas = await motoristaService.getMotoristas();
        res.status(200).json(motoristas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMotorista = async (req, res) => {
    try {
        const motorista = await motoristaService.getMotorista(req.params.id);
        if (motorista) {
            res.status(200).json(motorista);
        } else {
            res.status(404).json({ message: 'Motorista not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const motorista_init = async (req, res) => {
    try {
        await Motorista.deleteMany({});
        res.status(200).json({ message: "All motoristas have been deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateMotorista = async (req, res) => {
    try {
        const updatedMotorista = await motoristaService.updateMotorista(req.params.id, req.body);
        res.status(200).json(updatedMotorista);
    } catch (error) {
        console.error('Error updating motorista:', error);
        res.status(error.name === 'ValidationError' ? 400 : 500).json({ 
            message: error.message,
            details: error.errors ? Object.values(error.errors).map(e => e.message) : undefined
        });
    }
};

const deleteMotorista = async (req, res) => {
    try {
        const result = await motoristaService.deleteMotorista(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting motorista:', error);
        res.status(error.message.includes('não encontrado') ? 404 : 400).json({ 
            message: error.message
        });
    }
};

module.exports = {
    createMotorista,
    getMotoristas,
    getMotorista,
    motorista_init,
    updateMotorista,
    deleteMotorista
};
