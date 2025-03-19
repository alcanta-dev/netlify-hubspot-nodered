let fetch;

exports.handler = async (event, context) => {
  // Carica node-fetch dinamicamente se non è già stato caricato
  if (!fetch) {
    const module = await import('node-fetch');
    fetch = module.default;
  }

  // Gestisci la richiesta preflight (OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Consenti tutte le origini
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Consenti header specifici
        'Access-Control-Allow-Methods': 'POST, OPTIONS', // Consenti metodi specifici
      },
      body: '', // Nessun corpo nella risposta preflight
    };
  }

  try {
    // Verifica che la richiesta sia di tipo POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*', // Consenti tutte le origini
          'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Consenti header specifici
        },
        body: JSON.stringify({ error: 'Metodo non consentito' }),
      };
    }

    // Ottieni i dati inviati dal form HubSpot
    const data = JSON.parse(event.body);
    const type = data.type || 'default';


    // Imposta il webhook di destinazione in base al tipo
    let webhookUrl;
    if (type === 'confirm') {
      webhookUrl = 'https://mylab.alcanta.it/confirm';
    } else {
      webhookUrl = 'https://mylab.alcanta.it/contatti-convegno';
    }

    // Aggiungi il token di autenticazione
    data.token = process.env.AUTH_TOKEN;

    // Invia i dati al webhook di NodeRED
    const response = await fetch(webhookUrl, {
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

    // Risposta di successo per HubSpot
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Consenti tutte le origini
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Consenti header specifici
      },
      body: JSON.stringify({ success: true, message: 'Dati inviati correttamente a NodeRED' }),
    };
  } catch (error) {
    // Gestione degli errori
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Consenti tutte le origini
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Consenti header specifici
      },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
