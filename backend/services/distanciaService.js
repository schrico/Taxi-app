const RAIO_TERRA = 6371; // Raio da Terra em quilômetros

// Fórmula de Haversine para calcular distância entre dois pontos
function calcularDistancia(lat1, lon1, lat2, lon2) {
    // Converter de graus para radianos
    const toRadians = (graus) => graus * (Math.PI / 180);
    
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distancia = RAIO_TERRA * c; // Distância em km
    
    return distancia;
}

// Calcular tempo estimado com base na distância (assumindo uma velocidade média de 30km/h)
function calcularTempoEstimado(distancia) {
    const velocidadeMedia = 30; // km/h
    return (distancia / velocidadeMedia) * 60; // Tempo em minutos
}

module.exports = {
    calcularDistancia,
    calcularTempoEstimado
};