let fetch;

exports.handler = async (event, context) => {
  // Carica node-fetch dinamicamente se non è già stato caricato
  if (!fetch) {
    const module = await import('node-fetch');
    fetch = module.default;
  }

  try {
    // Verifica che la richiesta sia di tipo POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*', // Consenti tutte le origini
          'Access-Control-Allow-Headers': 'Content-Type', // Consenti header specifici
        },
        body: JSON.stringify({ error: 'Metodo non consentito' }),
      };
    }

    // Ottieni i dati inviati dal form
    const data = JSON.parse(event.body);

    // Invia i dati al webhook di NodeRED
    const response = await fetch('https://mylab.alcanta.it/contatti-convegno', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.AUTH_TOKEN, // Usa il token dalla variabile d'ambiente
      },
      body: JSON.stringify(data), // Invia i dati del form
    });

    // Verifica se la richiesta a NodeRED è andata a buon fine
    if (!response.ok) {
      throw new Error('Errore durante l\'invio dei dati a NodeRED');
    }

    // Risposta di successo
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Consenti tutte le origini
        'Access-Control-Allow-Headers': 'Content-Type', // Consenti header specifici
      },
      body: JSON.stringify({ message: 'Dati inviati correttamente a NodeRED' }),
    };
  } catch (error) {
    // Gestione degli errori
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Consenti tutte le origini
        'Access-Control-Allow-Headers': 'Content-Type', // Consenti header specifici
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
