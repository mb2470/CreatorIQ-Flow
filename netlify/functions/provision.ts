import { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event) => {
  // 1. Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // 2. Parse the incoming email from the frontend
  const { email } = JSON.parse(event.body || '{}');

  try {
    // 3. The "Shotgun" Payload to satisfy Echelon's "Name and email required" check
    const response = await axios.post('https://www.buyechelon.com/api/consumer/signup', {
      email: email,
      name: "Agent Handshake",      
      firstName: "Agent",           
      lastName: "Handshake",
      first_name: "Agent",          
      last_name: "Handshake",
      password: "ProvisioningAgent2026!",
      confirmPassword: "ProvisioningAgent2026!"
    });

    // 4. Return the success data (Tenant ID, API Key, etc.)
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response.data),
    };

  } catch (error: any) {
    // 5. Improved error reporting
    const errorMessage = error.response?.data?.message || error.response?.data?.error || "Echelon API Error";
    console.error("Echelon Rejection:", error.response?.data);
    
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: errorMessage,
        details: error.response?.data 
      }),
    };
  }
};
