const Pedido = require('../models/pedido');
const Cliente = require('../models/cliente');
const axios = require('axios');
const distanciaService = require('./distanciaService');
const turno = require('../models/turno');
const Taxi = require('../models/taxi');
const mongoose = require('mongoose');

const LOCALIZACAO_PADRAO = {
    latitude: 38.756734,
    longitude: -9.155412
};

async function geocodeAddress(morada) {
    // Construa o endereço para consulta
    const parts = [morada.rua, morada.nmrPorta, morada.codigoPostal, morada.localidade].filter(Boolean).join(', ');
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parts)}`;
    const resp = await axios.get(url, { headers: { 'User-Agent': 'psi49-taxi-app' } });
    if (resp.data && resp.data.length > 0) {
        return {
            latitude: resp.data[0].lat,
            longitude: resp.data[0].lon
        };
    }
    return null;
}

const getPedido = async (id) => {
    return await Pedido.findById(id).populate('cliente').populate('motoristaId');
};

const getPedidoPorMotorista = async (motoristaId) => {
    try {
        // Converter string ID para ObjectId se necessário
        let motoristaBusca = motoristaId;
        if (mongoose.Types.ObjectId.isValid(motoristaId)) {
            motoristaBusca = new mongoose.Types.ObjectId(motoristaId);
        }
        
        console.log(`Buscando pedidos para motorista: ${motoristaId}`);
        
        // Buscar usando o nome correto do campo (motorista)
        const pedidos = await Pedido.find({motorista: motoristaBusca})
            .populate('cliente');
            
        console.log(`Encontrados ${pedidos.length} pedidos`);
        return pedidos;
    } catch (error) {
        console.error('Erro ao buscar pedidos por motorista:', error);
        throw error;
    }
};

const getPedidosPendentesPorDistancia = async (posicaoMotorista, motoristaId) => {
    // Usar localização padrão se não for fornecida
    const localizacao = posicaoMotorista || LOCALIZACAO_PADRAO;
    
    let turnoFimDate = null;
    let confortoTaxi = null;

    if(motoristaId){
        const agora = new Date();
        const turnoAtivo = await turno.findOne({
            motoristaId,
            inicio: {$lte: agora},
            fim: {$gte: agora}
        }).populate('taxiId');

        if(!turnoAtivo){
            return[];
        }

        turnoFimDate = new Date(turnoAtivo.fim);

        if(turnoAtivo.taxiId){
            confortoTaxi = turnoAtivo.taxiId.conforto;
        }else{
            console.log("Táxi não encontrado no turno ativo");
            return[];
        }
    }else{
        turnoFimDate = new Date();

    }

    // Buscar todos os pedidos pendentes
    //const pedidos = await Pedido.find({ estado: 'Pendente' }).populate('cliente', 'nome');
    let query = {estado: 'Pendente'};

    if(confortoTaxi){
        query.conforto = confortoTaxi;
    }

    const pedidos = await Pedido.find(query).populate('cliente', 'nome');
    
    // Calcular distância e tempo estimado para cada pedido
    const pedidosComDistancia = pedidos.map(pedido => {
        const distancia = distanciaService.calcularDistancia(
            localizacao.latitude,
            localizacao.longitude,
            pedido.origem.latitude,
            pedido.origem.longitude
        );
        
        const tempoEstimadoMinutos = distanciaService.calcularTempoEstimado(distancia);
        
        // Tempo estimado para completar a viagem (ida + viagem até destino)
        // Assumindo que a viagem até o destino leva o mesmo tempo que a ida até o cliente
        const tempoTotalEstimado = tempoEstimadoMinutos * 2;
        
        return {
            ...pedido.toObject(),
            distancia: parseFloat(distancia.toFixed(2)),
            tempoEstimado: Math.ceil(tempoEstimadoMinutos),
            tempoTotal: Math.ceil(tempoTotalEstimado)
        };
    });
    
    // Filtrar pedidos que podem ser concluídos antes do fim do turno
    const agora = new Date();
    const minutosAteTerminarTurno = (turnoFimDate - agora) / (1000 * 60);
    
    const pedidosValidos = pedidosComDistancia.filter(pedido => {
        return pedido.tempoTotal <= minutosAteTerminarTurno;
    });
    
    // Ordenar por distância (ascendente)
    return pedidosValidos.sort((a, b) => a.distancia - b.distancia);
};

// Aceitar um pedido
const aceitarPedido = async (pedidoId, motoristaId) => {
    const pedido = await Pedido.findById(pedidoId);
    
    if (!pedido) {
        throw new Error('Pedido não encontrado');
    }
    
    if (pedido.estado !== 'Pendente') {
        throw new Error('Este pedido já foi processado');
    }
    
    pedido.estado = 'Aceite-Motorista';
    pedido.motorista = motoristaId;
    
    return await pedido.save();
};

// Confirmar motorista (quando o cliente confirma o motorista)
const confirmarMotorista = async (pedidoId) => {
    const pedido = await Pedido.findById(pedidoId);
    
    if (!pedido) {
        throw new Error('Pedido não encontrado');
    }
    
    if (pedido.estado !== 'Aceite-Motorista') {
        throw new Error('Este pedido já foi aceite');
    }
    
    pedido.estado = 'Aceite-Cliente';
    return await pedido.save();
};

// Rejeitar um pedido (quando o cliente rejeita o motorista)
const rejeitarMotorista = async (pedidoId) => {
    const pedido = await Pedido.findById(pedidoId);
    
    if (!pedido) {
        throw new Error('Pedido não encontrado');
    }
    
    // Volta para pendente para que outro motorista possa aceitar
    pedido.estado = 'Pendente';
    pedido.motorista = null;
    
    return await pedido.save();
};

const createPedido = async (pedidoData) => {
    try {
        let cliente = await Cliente.findOne({ nif: pedidoData.cliente.nif });
        if (!cliente) {
            cliente = new Cliente(pedidoData.cliente);
            await cliente.save();
        }

        let origem = pedidoData.origem;
        let destino = pedidoData.destino;

        // Se não vierem coordenadas de origem, tenta obter
        if (!origem.latitude || !origem.longitude) {
            const origemCoords = await geocodeAddress(origem);
            if (origemCoords) {
                origem.latitude = origemCoords.latitude;
                origem.longitude = origemCoords.longitude;
            }
        }

        // Se não vierem coordenadas de destino, tenta obter
        if (!destino.latitude || !destino.longitude) {
            const destinoCoords = await geocodeAddress(destino);
            if (destinoCoords) {
                destino.latitude = destinoCoords.latitude;
                destino.longitude = destinoCoords.longitude;
            }
        }

        const pedido = new Pedido({
            cliente: cliente._id,
            origem: origem,
            destino: destino,
            conforto: pedidoData.conforto,
            nmrPessoas: pedidoData.nmrPessoas
        });
        return await pedido.save();
    } catch (error) {
        throw error;
    }
};

const deletePedido = async (id) => {
    try {
        const pedido = await Pedido.findByIdAndDelete(id);
        if (!pedido) {
            throw new Error('Pedido not found');
        }
        return pedido;
    } catch (error) {
        throw error;
    }
};

const deleteAllPedidos = async () => {
    try {
        const pedidos = await Pedido.deleteMany({});
        return pedidos;
    } catch (error) {
        throw error;
    }
};

const getPedidosPorEstado = async (estado) => {
    if (!estado) {
      throw new Error('O estado é obrigatório');
    }
    
    return await Pedido.find({ estado: estado }).populate('cliente', 'nome');
  };

const getPedidos = async () => {
    return await Pedido.find().populate('cliente', 'nome');
};

const getPedidosPendentes = async () => {
    return await Pedido.find({ estado: 'Pendente' }).populate('cliente', 'nome');
};

const getViagens = async () => {
    return await pedido.find();
};

const getpedido = async (id) => {
    return await pedido.findById(id);
};

const getClientes = async () => {
    return await Cliente.find();
};

const getCliente = async (id) => {
    return await Cliente.findById(id);
};

module.exports = {
    createPedido,
    deletePedido,
    getPedidos,
    getPedido,
    getViagens,
    getpedido,
    getClientes,
    getCliente,
    getPedidosPendentes,
    getPedidosPorEstado,
    getPedidosPendentesPorDistancia,
    aceitarPedido,
    rejeitarMotorista,
    confirmarMotorista,
    getPedidoPorMotorista
};