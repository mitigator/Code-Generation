// backend-code-gen/flowiseTest.js
require('dotenv').config();
const axios = require('axios');

const FLOWISE_URL = process.env.FLOWISE_API_URL || 'http://localhost:3000';
const ENTITY_GENERATION_FLOW_ID = process.env.FLOWISE_ENTITY_GENERATION_FLOW_ID || 'd93a1ded-dc5d-416f-91d5-f8a16540e95b';

async function testFlow() {
  console.log('Testing FlowiseAI connection...');
  
  try {
    const response = await axios.post(`${FLOWISE_URL}/api/v1/prediction/${ENTITY_GENERATION_FLOW_ID}`, {
      question: "Generate entities for this project",
      project_name: "Employee Management System",
      project_description: "A web-based application to manage employee records, including personal details, job roles, attendance, salary, and performance reviews."
    });
    
    console.log('FlowiseAI response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('FlowiseAI error:', error.response?.data || error.message);
    throw error;
  }
}

testFlow()
  .then(result => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });