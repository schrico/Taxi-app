const Viagem = require('../models/viagem');
const Turno = require('../models/turno');
const Pedido = require('../models/pedido');
const Taxi = require('../models/taxi');
const geocodingService = require('./geocodingService');

// Função para calcular distância utilizando fórmula de Haversine
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distância em km
    return d;
}

function calcularPreco(distancia, duracao){
    const preco = 3.25;
    preco += distancia * 0.8;
    preco += (duracao / 60) * 0.25;

    return Math.max(3.25, preco);
}

function toRad(value) {
    return value * Math.PI / 180;
}

// Função para calcular preço da viagem
function calcularPreco(tempoMinutos, distanciaKm) {
    // Exemplo de cálculo: tarifa base + preço por minuto + preço por km
    const tarifaBase = 3.25;
    const precoPorMinuto = 0.25;
    const precoPorKm = 0.8;
    
    return tarifaBase + (precoPorMinuto * tempoMinutos) + (precoPorKm * distanciaKm);
}

exports.iniciarViagem = async (data) => {
  console.log("Dados recebido:", data);
  const { pedido, motoristaId, turnoId} = data;
    // Validações
    const pedidoDb = await Pedido.findById(pedido._id);
    console.log("ATE AQUI OK");
    if (!pedidoDb) {
      throw new Error('Pedido inválido ou não pertence ao motorista');
    }


    
    if (pedido.estado !== 'Aceite-Cliente') {
      throw new Error('Pedido não está confirmado pelo cliente');
    }
    
    const turno = await Turno.findById(turnoId);
    if (!turno || turno.motoristaId.toString() !== motoristaId) {
      throw new Error('Turno inválido ou não pertence ao motorista');
    }
    
    // Verificar se turno está ativo
    const agora = new Date();
    const inicioTurno = new Date(turno.inicio);
    const fimTurno = new Date(turno.fim);
    if (agora < inicioTurno || agora > fimTurno) {
      throw new Error('Fora do período do turno');
    }
    
    // Verificar capacidade do táxi
    const taxi = await Taxi.findById(turno.taxiId);
    if (pedido.nmrPessoas > taxi.capacidade) {
      throw new Error(`Excede capacidade do táxi (${taxi.capacidade} pessoas)`);
    }
    
    // Verificar se já existe viagem em andamento
    const viagemAtiva = await Viagem.findOne({
      motoristaId,
      estado: 'em_andamento'
    });
    if (viagemAtiva) {
      throw new Error('Já existe uma viagem em andamento');
    }
    
    // Obter número sequencial (RIA 18)
    const viagensNoTurno = await Viagem.countDocuments({ turnoId });
    const numeroSequencia = viagensNoTurno + 1;
    
    const endereco = await geocodingService.obterEnderecoPorCoordenadas(
      pedido.origem.latitude, pedido.origem.longitude
    );
    
    // Criar viagem
    const viagem = new Viagem({
      pedidoId: pedido._id,
      motoristaId,
      turnoId,
      taxiId: turno.taxiId,
      numeroSequencia, // Calculado previamente
      nmrPessoas: pedido.nmrPessoas,
      inicio: {
        data: new Date(),
        morada: {
          rua: pedido.origem.rua,
          nmrPorta: pedido.origem.nmrPorta,
          codigoPostal: pedido.origem.codigoPostal,
          localidade: pedido.origem.localidade,
          latitude: pedido.origem.latitude,
          longitude: pedido.origem.longitude
        }
      },
      fim: {
        morada: {
          rua: pedido.destino.rua,
          nmrPorta: pedido.destino.nmrPorta,
          codigoPostal: pedido.destino.codigoPostal,
          localidade: pedido.destino.localidade,
          latitude: pedido.destino.latitude,
          longitude: pedido.destino.longitude
        }
      },
      estado: 'andamento'
    });
    
    await viagem.save();
    return viagem;
  };

  exports.finalizarViagem = async (viagemId) => {
    const viagem = await Viagem.findById(viagemId);
    console.log("Ate aqui ok1");
    if (!viagem) {
      throw new Error('Viagem não encontrada ou já finalizada');
    }

    
    // Registrar hora fim
    const horaFim = new Date();
    viagem.fim.data = horaFim;

    // RIA 5: Início anterior ao fim
    if (viagem.inicio.data >= horaFim) {
      throw new Error('Hora de fim deve ser posterior à hora de início');
    }
    console.log("Ate aqui ok4");
    const lat1 = viagem.inicio.morada.latitude;
    const lng1 = viagem.inicio.morada.longitude;
    const lat2 = viagem.fim.morada.latitude;
    const lng2 = viagem.fim.morada.longitude;

    // Calcular distância
    const distancia = calcularDistancia(lat1, lng1, lat2, lng2);

    if (distancia < 0) {
      throw new Error('Distância tem de ser positiva');
    }

    viagem.quilometros = distancia;

    // Calcular preço
    const duracao = (horaFim - viagem.inicio.data) / (1000 * 60); // em minutos
    const preco = calcularPreco(distancia, duracao);
    viagem.precoTotal = preco;

    viagem.estado = 'finalizada';

    await viagem.save();
    return viagem;
  };

exports.getViagensByMotorista = async (motoristaId) => {
    return await Viagem.find({ motoristaId })
        .populate('taxiId', 'marca modelo')
        .populate('pedidoId')
        .sort({ inicio: -1 });
};

exports.getViagemAtiva = async (motoristaId) => {
    return await Viagem.findOne({
        motoristaId,
        estado: 'andamento'
    })
    .populate('pedidoId');
};

exports.listarViagensPorMotorista = async (motoristaId) => {
    try {
        // Buscar todos os turnos do motorista
        const turnos = await Turno.find({ motoristaId });
        const turnoIds = turnos.map(turno => turno._id);
        
        // Buscar viagens desses turnos, ordenadas por data de início
        const viagens = await Viagem.find({ turnoId: { $in: turnoIds } })
            .populate('turnoId')
            .populate('pedidoId')
            .sort({ 'inicio.data': -1 });
            
        return viagens;
    } catch (error) {
        throw error;
    }
};

exports.deleteViagens = async () => {
    await Viagem.deleteMany({});
};