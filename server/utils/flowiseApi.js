const fs = require('fs');
const axios = require('axios');

exports.callFlowiseAPI = async (endpointId, data) => {
  try {
    const url = `http://localhost:3000/api/v1/prediction/${endpointId}`;
    
    let requestBody = {};
    
    // If there's a file path, read the file and add its content to the request
    if (data.file && fs.existsSync(data.file)) {
      const fileContent = fs.readFileSync(data.file, 'utf8');
      requestBody = { question: fileContent };
    } else {
      requestBody = { question: JSON.stringify(data) };
    }
    
    const response = await axios.post(url, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error calling Flowise API:', error);
    throw new Error(`API call failed: ${error.message}`);
  }
};