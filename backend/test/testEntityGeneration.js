// Example client-side usage (e.g., in a test script or frontend)
import fetch from 'node-fetch';

const testEntityGeneration = async () => {
  try {
    // This is your JSON input data that will be passed to Flowise
    const entityData = {
      "project_name": "Hospital management System",
       "project_description": "A web based hospital management system"
      
   };

    // Send request to your server's entity generation endpoint
    const response = await fetch('http://localhost:4000/api/entity/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entityData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Entity generation result:', result);
    return result;
  } catch (error) {
    console.error('Error testing entity generation:', error);
    throw error;
  }
};

// Execute the test
testEntityGeneration()
  .then(result => console.log('Test completed successfully'))
  .catch(error => console.error('Test failed:', error));