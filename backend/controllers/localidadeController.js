const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

let codigosPostais = {};

// Load CSV data on controller initialization
const loadCodigosPostais = () => {
  const csvPath = path.join(__dirname, '..', 'data', 'codigos_postais.csv');
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csvParser({ separator: ',' }))
      .on('data', (row) => {
        const codigoPostal = `${row.num_cod_postal}-${row.ext_cod_postal}`;
        codigosPostais[codigoPostal] = row.desig_postal;
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        console.error('Erro ao carregar CSV:', error);
        reject(error);
      });
  });
};

// Initialize data when controller is loaded
loadCodigosPostais().catch(error => {
  console.error('Falha ao carregar códigos postais:', error);
});

// Get localidade by código postal
exports.obterLocalidadePorCodigoPostal = async (codigoPostal) => {
  try {
    // Ensure códigos postais are loaded
    if (Object.keys(codigosPostais).length === 0) {
      await loadCodigosPostais();
    }
    
    return {
      success: true,
      localidade: codigosPostais[codigoPostal] || null
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao obter localidade',
      details: error.message
    };
  }
};