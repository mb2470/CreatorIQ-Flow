import { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const { email } = JSON.parse(event.body || '{}');

  try {
    // Adding more standard fields to satisfy the 400 error
    const response = await axios.post('https://www.buyechelon.com/api/consumer/signup', {
      email: email,
      password: "AgentPassword123!", 
      firstName: "Agent",
      lastName: "GigAgency",
      confirmPassword: "AgentPassword123!",
      marketingOptIn: false,
      zipCode: "90210" // Some Echelon endpoints require a valid ZIP
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response.data),
    };
  } catch (error: any) {
    // This logs the SPECIFIC reason from Echelon in your Netlify logs
    console.error("Echelon API Error:", error.response?.data);
    
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ 
        error: error.response?.data?.message || "Check Netlify logs for API rejection reason." 
      }),
    };
  }
};
