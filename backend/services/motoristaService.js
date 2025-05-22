const Motorista = require('../models/motorista');
const localidadeController = require('../controllers/localidadeController');
const Turno = require('../models/turno');


const createMotorista = async (motoristaData) => {
    try {

        // Get localidade from código postal
        const localidadeResult = await localidadeController.obterLocalidadePorCodigoPostal(motoristaData.morada.codigoPostal);
        
        if (localidadeResult && localidadeResult.success && localidadeResult.localidade) {
            motoristaData.morada.Localidade = localidadeResult.localidade;
        } else {
            // Set a default value if localidade lookup fails
            motoristaData.morada.Localidade = 'Não disponível';
        }

        // Convert string NIF to number if needed
        if (typeof motoristaData.nif === 'string') {
            motoristaData.nif = parseInt(motoristaData.nif);
        }

        // Convert string nmrCartaConducao to number if needed
        if (typeof motoristaData.nmrCartaConducao === 'string') {
            motoristaData.nmrCartaConducao = parseInt(motoristaData.nmrCartaConducao);
        }

        const motorista = new Motorista(motoristaData);
        const validationError = motorista.validateSync();
        if (validationError) {
            console.error('Validation error:', validationError);
            throw validationError;
        }

        return await motorista.save();
    } catch (error) {
        console.error('Error in createMotorista:', error);
        throw error;
    }
};

const getMotoristas = async () => {
    return await Motorista.find().sort({ updatedAt: -1 });
};

const getMotorista = async (id) => {
    return await Motorista.findById(id);
};

const updateMotorista = async (id, updateData) => {
    try {
        // Find the motorista first
        const motorista = await Motorista.findById(id);
        if (!motorista) {
            throw new Error('Motorista não encontrado');
        }

        // Get localidade from código postal if morada is being updated
        if (updateData.morada?.codigoPostal) {
            const localidadeResult = await localidadeController.obterLocalidadePorCodigoPostal(updateData.morada.codigoPostal);
            
            if (localidadeResult && localidadeResult.success && localidadeResult.localidade) {
                updateData.morada.Localidade = localidadeResult.localidade;
            } else {
                updateData.morada.Localidade = 'Não disponível';
            }
        }

        // Convert string NIF to number if needed
        if (updateData.nif && typeof updateData.nif === 'string') {
            updateData.nif = parseInt(updateData.nif);
        }

        // Convert string nmrCartaConducao to number if needed
        if (updateData.nmrCartaConducao && typeof updateData.nmrCartaConducao === 'string') {
            updateData.nmrCartaConducao = parseInt(updateData.nmrCartaConducao);
        }

        // Update the fields
        Object.keys(updateData).forEach(key => {
            if (key === 'morada' && typeof updateData[key] === 'object') {
                Object.keys(updateData.morada).forEach(moradaKey => {
                    if (updateData.morada[moradaKey] !== undefined) {
                        motorista.morada[moradaKey] = updateData.morada[moradaKey];
                    }
                });
            } else {
                motorista[key] = updateData[key];
            }
        });

        // Validate before saving
        const validationError = motorista.validateSync();
        if (validationError) {
            throw validationError;
        }

        // Save and return updated motorista
        return await motorista.save();
    } catch (error) {
        console.error('Error in updateMotorista:', error);
        throw error;
    }
};

// Add this function to handle deletion with the same restriction
const deleteMotorista = async (id) => {
    try {
        // Check if motorista exists
        const motorista = await Motorista.findById(id);
        if (!motorista) {
            throw new Error('Motorista não encontrado');
        }

        // Check if motorista has any turnos
        const turnosExistentes = await Turno.find({ motoristaId: id });
        if (turnosExistentes && turnosExistentes.length > 0) {
            throw new Error('Não é possível remover motorista com turnos associados');
        }

        // If all checks pass, delete the motorista
        await Motorista.findByIdAndDelete(id);
        return { message: 'Motorista removido com sucesso' };
    } catch (error) {
        console.error('Error in deleteMotorista:', error);
        throw error;
    }
};

module.exports = {
    createMotorista,
    getMotoristas,
    getMotorista,
    updateMotorista,
    deleteMotorista
};
