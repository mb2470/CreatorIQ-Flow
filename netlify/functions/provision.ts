import { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const { email } = JSON.parse(event.body || '{}');

  try {
    const response = await axios.post('https://www.buyechelon.com/api/consumer/signup', {
      email,
      firstName: "Agent",
      lastName: "TheGigAgency",
      password: "TempPassword123!" // This can be changed later
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response.data),
    };
  } catch (error: any) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
