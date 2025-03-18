let fetch;
import('node-fetch').then(module => {
  fetch = module.default;
});

exports.handler = async (event, context) => {
  if (!fetch) {
    await import('node-fetch').then(module => {
      fetch = module.default;
    });
  }

  try {
    // Logica della funzione
    const response = await fetch('https://mylab.alcanta.t/contatti-convegno', { 
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.AUTH_TOKEN,
      },
      body: JSON.stringify(data),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Dati inviati correttamente a NodeRED' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
