const pedidoService = require('../services/pedidoService');
const Pedido = require('../models/pedido');
const Cliente = require('../models/cliente');

exports.pedir_taxi = async (req, res) => {
    try {
        const pedido = await pedidoService.createPedido(req.body);
        res.status(201).json({ message: 'Pedido de táxi criado', pedido });
    } catch (error) {
        res.status(400).json({ message: error.message, details: error.errors ? Object.values(error.errors).map(e => e.message) : undefined });
    }
};

exports.get_pedidos_por_distancia = async (req, res) => {
    try {
        const { latitude, longitude, motoristaId } = req.query;
        const posicaoMotorista = latitude && longitude ? { latitude, longitude } : null;
        
        console.log('Posição do motorista:', posicaoMotorista);
        console.log('ID do motorista:', motoristaId);

        const pedidos = await pedidoService.getPedidosPendentesPorDistancia(posicaoMotorista, motoristaId);
        console.log('Pedidos encontrados:', pedidos.length);
        
        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Erro ao obter pedidos por distância:', error);
        res.status(500).json({ message: error.message });
    }
};

// Aceitar um pedido
exports.aceitar_pedido = async (req, res) => {
    try {
        const { pedidoId } = req.params;
        const { motoristaId } = req.body;
        
        if (!pedidoId || !motoristaId) {
            return res.status(400).json({ message: 'IDs do pedido e motorista são obrigatórios' });
        }
        
        const pedido = await pedidoService.aceitarPedido(pedidoId, motoristaId);
        res.status(200).json({ message: 'Pedido aceito com sucesso', pedido });
    } catch (error) {
        console.error('Erro ao aceitar pedido:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.get_pedidos_por_motorista = async (req, res) => {
    try {
        const { motoristaId } = req.params;
        
        if (!motoristaId) {
            return res.status(400).json({ message: 'ID do motorista é obrigatório' });
        }
        
        const pedidos = await pedidoService.getPedidoPorMotorista(motoristaId);
        res.json(pedidos);
    } catch (error) {
        console.error('Erro ao processar pedidos por motorista:', error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
};

// Rejeitar um pedido (quando o cliente rejeita o motorista)
exports.rejeitar_motorista = async (req, res) => {
    try {
        const { pedidoId } = req.params;
        
        if (!pedidoId) {
            return res.status(400).json({ message: 'ID do pedido é obrigatório' });
        }
        
        const pedido = await pedidoService.rejeitarPedido(pedidoId);
        res.status(200).json({ message: 'Pedido rejeitado com sucesso', pedido });
    } catch (error) {
        console.error('Erro ao rejeitar pedido:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.get_pedidos = async (req, res) => {
    try {
        const pedidos = await pedidoService.getPedidos();
        res.status(200).json(pedidos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.get_pedidos_por_estado = async (req, res) => {
    try {
      const { estado } = req.params;
      const pedidos = await pedidoService.getPedidosPorEstado(estado);
      res.status(200).json(pedidos);
    } catch (error) {
      console.error('Erro ao buscar pedidos por estado:', error);
      res.status(500).json({ message: error.message });
    }
  };

exports.get_pedidos_pendentes = async (req, res) => {
    try {
        const pedidos = await pedidoService.getPedidosPendentes();
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao obter pedidos pendentes', error: err.message });
    }
};

exports.cancelar_pedido = async (req, res) => {
    try {
        console.log('Attempting to delete pedido with ID:', req.params.id); // Add this log
        const pedido = await pedidoService.deletePedido(req.params.id);
        if (!pedido) {
            console.log('Pedido not found'); // Add this log
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        console.log('Pedido deleted successfully:', pedido); // Add this log
        res.status(200).json({ message: 'Pedido cancelado com sucesso', pedido });
    } catch (error) {
        console.error('Error in cancelar_pedido:', error); // Add this log
        res.status(500).json({ message: error.message });
    }
};

exports.deletePedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.deleteMany({});
        res.status(200).json({ message: 'Todos os pedidos foram cancelados com sucesso', pedidos });
    } catch (error) {
        console.error('Error in deletePedidos:', error); // Add this log
        res.status(500).json({ message: error.message });
    }
}

exports.getClientes = async (req, res) => {
    try {
        const clientes = await pedidoService.getClientes();
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Error in getClientes:', error); // Add this log
        res.status(500).json({ message: error.message });
    }
};

exports.getPedidos = async (req, res) => {
    try {
        const pedidos = await pedidoService.getPedidos();
        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error in getPedidos:', error); // Add this log
        res.status(500).json({ message: error.message });
    }
};

exports.deleteClientes = async (req, res) => {
    try {
        const clientes = await Cliente.deleteMany({});;
        res.status(200).json({ message: 'Todos os clientes foram cancelados com sucesso', clientes });
    } catch (error) {
        console.error('Error in deleteClientes:', error); // Add this log
        res.status(500).json({ message: error.message });
    }
};

exports.confirmar_motorista = async (req, res) => {
    try {
        const { pedidoId } = req.params;
        
        if (!pedidoId) {
            return res.status(400).json({ message: 'ID do pedido é obrigatório' });
        }
        
        const pedido = await pedidoService.confirmarMotorista(pedidoId);
        res.status(200).json({ message: 'Motorista confirmado com sucesso', pedido });
    } catch (error) {
        console.error('Erro ao confirmar motorista:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.get_pedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await pedidoService.getPedido(id);
        
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        
        res.status(200).json(pedido);
    } catch (error) {
        console.error('Erro ao obter pedido:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.get_pedido_by_id = async (req, res) => {
    try {
      const pedido = await pedidoService.getPedido(req.params.id);
      
      if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      
      res.status(200).json(pedido);
    } catch (error) {
      console.error('Erro ao buscar pedido por ID:', error);
      res.status(500).json({ message: error.message });
    }
  };