import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const FLOWISE_API_URL = process.env.FLOWISE_API_URL;
const FLOWISE_API_ENDPOINT = process.env.FLOWISE_API_ENDPOINT;

export const queryFlowiseApi = async (jsonData) => {
  try {
    const apiUrl = `${FLOWISE_API_URL}/${FLOWISE_API_ENDPOINT}`;
    
    const requestData = {
      question: JSON.stringify(jsonData)
    };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling Flowise API:', error);
    throw new Error(`Flowise API call failed: ${error.message}`);
  }
};