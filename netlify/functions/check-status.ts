import { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event) => {
  // Use the Netlify Environment Variable
  const mcpKey = process.env.MCP_KEY;

  if (!mcpKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "MCP_KEY not configured in Netlify" }),
    };
  }

  try {
    const response = await axios.get('https://gateway.buyechelon.com/v1/agent/status', {
      headers: { 
        'Authorization': `Bearer ${mcpKey}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'active', data: response.data }),
    };
  } catch (error: any) {
    return {
      statusCode: 403,
      body: JSON.stringify({ status: 'restricted', error: error.message }),
    };
  }
};
