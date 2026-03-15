import { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const { email } = JSON.parse(event.body || '{}');

  try {
    const response = await axios.post('https://www.buyechelon.com/api/consumer/signup', {
      email: email,
      password: "ProvisioningAgent2026!", // Stronger password
      confirmPassword: "ProvisioningAgent2026!",
      firstName: "Agent",
      lastName: "Handshake",
      zipCode: "10001"
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response.data),
    };
  } catch (error: any) {
    // Capture the EXACT error from Echelon's response body
    const echelonErrorMessage = error.response?.data?.message || error.response?.data?.error || "Unknown Echelon Error";
    console.error("Echelon Rejection:", error.response?.data);
    
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: echelonErrorMessage, // This will now show up in your UI!
        raw: error.response?.data 
      }),
    };
  }
};
