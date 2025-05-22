const express = require("express");
const router = express.Router();

const taxiController = require("../controllers/taxiController");
const motoristaController = require("../controllers/motoristaController");
const servicoController = require("../controllers/servicoController");
const pedidoController = require("../controllers/pedidoController");
const turnoController = require('../controllers/turnoController');
const viagemController = require('../controllers/viagemController');
const relatorioController = require('../controllers/relatorioController');

// TAXIS ROUTES

router.get("/init", taxiController.taxi_init);

router.put('/taxis/:id', taxiController.updateTaxi);

router.delete('/taxis/:id', taxiController.deleteTaxi);

router.post('/taxis', taxiController.createTaxi);

router.get('/taxis', taxiController.getTaxis);

router.get('/taxis/:id', taxiController.getTaxi);


// MOTORISTA ROUTES

router.get("/motorista/init", motoristaController.motorista_init);

router.post("/motorista", motoristaController.createMotorista);

router.get("/motorista", motoristaController.getMotoristas);

router.get("/motorista/:id", motoristaController.getMotorista);

router.put("/motorista/:id", motoristaController.updateMotorista);

router.delete("/motorista/:id", motoristaController.deleteMotorista);

// SERVICOS ROUTES

router.get("/servicos/init", servicoController.servico_init);

router.post("/servicos", servicoController.createServico);

router.get("/servicos", servicoController.getServicos);

router.get("/servicos/:id", servicoController.getServico);


// Pedidos ROUTES

router.get('/pedidos/pendentes', pedidoController.get_pedidos_pendentes);

router.get("/pedidos/estado/:estado", pedidoController.get_pedidos_por_estado);

router.get('/pedidos/distancia', pedidoController.get_pedidos_por_distancia);

router.get('/pedidos/:id', pedidoController.get_pedido_by_id);

router.get("/pedidos", pedidoController.get_pedidos);

router.post("/pedido", pedidoController.pedir_taxi);

router.get("/pedidos/:id", pedidoController.get_pedido);

router.delete('/pedidos/:id', pedidoController.cancelar_pedido);

router.delete('/pedidos', pedidoController.deletePedidos);

router.get('/clientes', pedidoController.getClientes);

router.delete('/clientes', pedidoController.deleteClientes);

router.get('/pedidos', pedidoController.getPedidos);

router.get('/pedidos/motorista/:motoristaId', pedidoController.get_pedidos_por_motorista);


router.put('/pedidos/:pedidoId/aceitar', pedidoController.aceitar_pedido);

router.put('/pedidos/:pedidoId/rejeitar', pedidoController.rejeitar_motorista);

router.put('/pedidos/:pedidoId/confirmar', pedidoController.confirmar_motorista);


// TURNOS ROUTES

router.post("/turnos", turnoController.createTurno);

router.get('/turnos/disponiveis', turnoController.getAvailableTaxis);

router.get('/turnos/motorista/:motoristaId', turnoController.getTurnosByMotorista);

router.get('/turnos/ativos/:motoristaId', turnoController.getTurnoAtivo);

router.delete('/turnos', turnoController.deleteTurnos);

// VIAGENS ROUTES

router.post('/viagens', viagemController.iniciarViagem);

router.put('/viagens/:id', viagemController.finalizarViagem);

router.get('/viagens/motorista/:motoristaId', viagemController.listarViagensPorMotorista);

router.get('/viagens/motorista/:motoristaId/ativas', viagemController.getViagemAtiva);

router.post('/viagens/iniciar', viagemController.iniciarViagem);

router.post('/viagens/:viagemId/finalizar', viagemController.finalizarViagem);

router.delete('/viagens', viagemController.deleteViagens);

// RELATORIO ROUTES

router.get('/relatorios', relatorioController.getTotais);

router.get('/relatorios/subtotais', relatorioController.getSubtotais);

router.get('/relatorios/detalhes', relatorioController.getDetalhes);


module.exports = router;



