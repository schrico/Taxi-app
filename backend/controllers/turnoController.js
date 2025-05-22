const turnoService = require('../services/turnoService');
const asyncHandler = require('express-async-handler');
const Turno = require('../models/turno'); 

// Criar um turno
exports.createTurno = asyncHandler(async (req, res) => {
  try {
    const turno = await turnoService.createTurno(req.body);
    res.status(201).json(turno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar táxis disponíveis
exports.getAvailableTaxis = asyncHandler(async (req, res) => {
  try {
    const { inicio, fim } = req.query;
    const taxis = await turnoService.getAvailableTaxis(inicio, fim);
    res.status(200).json(taxis);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar turnos do motorista
exports.getTurnosByMotorista = asyncHandler(async (req, res) => {
  try {
    const { motoristaId } = req.params;
    const turnos = await turnoService.getTurnosByMotorista(motoristaId);
    res.status(200).json(turnos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

exports.getTurnoAtivo = asyncHandler(async (req, res) => {
  try {
    const { motoristaId } = req.params;
    const isAtivo = await turnoService.isTurnoAtivo(motoristaId);
    
    res.status(200).json({ ativo: isAtivo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

exports.deleteTurnos = asyncHandler(async (req, res) => {
  try {
    const pedidos = await Turno.deleteMany({});
    res.status(200).json({ message: 'Turnos deletados com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});