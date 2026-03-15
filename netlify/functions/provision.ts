import { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const { email } = JSON.parse(event.body || '{}');

  try {
    // MINIMAL PAYLOAD: Only sending what is strictly required for provisioning
    const response = await axios.post('https://www.buyechelon.com/api/consumer/signup', {
      email: email,
      firstName: "Agent",
      lastName: "Handshake"
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response.data),
    };
  } catch (error: any) {
    // LOG THE REAL ERROR: This is the only way to know why it's failing
    const errorDetail = error.response?.data || error.message;
    console.error("Echelon Rejection:", errorDetail);
    
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: "Echelon API Error", 
        detail: errorDetail 
      }),
    };
  }
};
