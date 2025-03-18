const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    // Verifica che la richiesta sia di tipo POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Metodo non consentito' }),
      };
    }

    // Ottieni i dati inviati dal form HubSpot
    const data = JSON.parse(event.body);

    // Definisci il token da inserire nell'header
    const token = 'oc$b2lQWTytHPmomwSrXW%QOUBT5105kkpsktPsQts@1aSFhOpS3j7ol4mXLpsye'; // Sostituisci con il tuo token

    // Invia i dati al webhook di NodeRED
    const response = await fetch('https://mylab.alcanta.it/contatti-convegno', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token, // Inserisci il token nell'header
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
      body: JSON.stringify({ message: 'Dati inviati correttamente a NodeRED' }),
    };
  } catch (error) {
    // Gestione degli errori
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
