// // backend-code-gen/utils/flowiseClient.js
// const axios = require('axios');

// /**
//  * Client for interacting with FlowiseAI API
//  */
// class FlowiseClient {
//   constructor() {
//     this.baseURL = process.env.FLOWISE_API_URL || 'http://localhost:3000';
    
//     this.axios = axios.create({
//       baseURL: this.baseURL,
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       timeout: 60000, // 60 seconds timeout
//     });
    
//     // Store flow IDs from environment variables or use defaults
//     this.descriptionFlowId = process.env.FLOWISE_DESCRIPTION_FLOW_ID || 'c78f0c45-93b0-4457-b173-aaec02ad84e8';
//     this.entityGenerationFlowId = process.env.FLOWISE_ENTITY_GENERATION_FLOW_ID || 'd93a1ded-dc5d-416f-91d5-f8a16540e95b';
//     this.entityRefinementFlowId = process.env.FLOWISE_ENTITY_REFINEMENT_FLOW_ID || 'baf34a50-f8e6-474a-9664-9c57523766c7';
//     this.codeGenerationFlowId = process.env.FLOWISE_CODE_GENERATION_FLOW_ID || '';
//   }

//   /**
//    * Run a specific FlowiseAI flow with input data
//    * @param {string} flowId - The ID of the flow to run
//    * @param {object} inputData - Input data for the flow
//    * @returns {Promise<object>} - Response from FlowiseAI
//    */
//   async runFlow(flowId, inputData) {
//     try {
//       console.log(`Running FlowiseAI flow ${flowId} with data:`, inputData);
      
//       // FlowiseAI expects data in a specific format with a question property
//       // Based on your previous API sample
//       const payload = {
//         question: "Hey, how are you?", // Default question (will be overridden by API logic)
//         ...inputData
//       };
      
//       const response = await this.axios.post(`/api/v1/prediction/${flowId}`, payload);
//       console.log(`FlowiseAI response from flow ${flowId}:`, response.data);
//       return response.data;
//     } catch (error) {
//       console.error('FlowiseAI API Error:', error.response?.data || error.message);
//       throw new Error(`FlowiseAI API Error: ${error.response?.data?.message || error.message}`);
//     }
//   }

//   /**
//    * Generate project description based on project name
//    * @param {string} projectName - Name of the project
//    * @returns {Promise<string>} - Generated project description
//    */
//   async generateDescription(projectName) {
//     try {
//       console.log('Generating description for project:', projectName);
      
//       // Based on your provided API example
//       const payload = {
//         question: "Hey, how are you?", // This will be handled by FlowiseAI
//         projectName: projectName
//       };
      
//       const result = await this.runFlow(this.descriptionFlowId, payload);
//       return result;
//     } catch (error) {
//       console.error('Error generating description:', error);
//       throw error;
//     }
//   }

//   /**
//    * Generate entities based on project name and description
//    * @param {string} projectName - Name of the project
//    * @param {string} projectDescription - Project description
//    * @returns {Promise<object>} - Generated entities
//    */
//   async generateEntities(projectName, projectDescription) {
//     try {
//       console.log('Generating entities for project:', projectName);
      
//       // Format payload according to FlowiseAI expectations
//       const payload = {
//         question: "Hey, how are you?", // This will be handled by FlowiseAI
//         project_name: projectName,
//         project_description: projectDescription
//       };
      
//       const result = await this.runFlow(this.entityGenerationFlowId, payload);
//       return result;
//     } catch (error) {
//       console.error('Error generating entities:', error);
//       throw error;
//     }
//   }

//   /**
//    * Refine entities based on project details and accepted/rejected entities
//    * @param {object} projectData - Project data including name, description, and entities
//    * @returns {Promise<object>} - Refined entities
//    */
//   async refineEntities(projectData) {
//     try {
//       console.log('Refining entities for project:', projectData.project_name);
      
//       // Format payload according to FlowiseAI expectations
//       const payload = {
//         question: "Hey, how are you?", // This will be handled by FlowiseAI
//         ...projectData
//       };
      
//       const result = await this.runFlow(this.entityRefinementFlowId, payload);
//       return result;
//     } catch (error) {
//       console.error('Error refining entities:', error);
//       throw error;
//     }
//   }

//   /**
//    * Generate code for a specific file
//    * @param {string} filePath - Path of the file to generate
//    * @param {object} projectContext - Project context and structure
//    * @returns {Promise<string>} - Generated code for the file
//    */
//   async generateCode(filePath, projectContext) {
//     try {
//       console.log('Generating code for file:', filePath);
      
//       // Format payload according to FlowiseAI expectations
//       const payload = {
//         question: "Hey, how are you?", // This will be handled by FlowiseAI
//         filePath,
//         projectContext
//       };
      
//       const result = await this.runFlow(this.codeGenerationFlowId, payload);
//       return result;
//     } catch (error) {
//       console.error('Error generating code:', error);
//       throw error;
//     }
//   }
// }

// module.exports = new FlowiseClient();

// backend-code-gen/utils/flowiseClient.js
const axios = require('axios');

/**
 * Client for interacting with FlowiseAI API
 */
class FlowiseClient {
  constructor() {
    this.baseURL = process.env.FLOWISE_API_URL || 'http://localhost:3000';
    
    this.axios = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000, // 60 seconds timeout
    });
    
    // Store flow IDs from environment variables or use defaults
    this.descriptionFlowId = process.env.FLOWISE_DESCRIPTION_FLOW_ID || 'c78f0c45-93b0-4457-b173-aaec02ad84e8';
    this.entityGenerationFlowId = process.env.FLOWISE_ENTITY_GENERATION_FLOW_ID || 'd93a1ded-dc5d-416f-91d5-f8a16540e95b';
    this.entityRefinementFlowId = process.env.FLOWISE_ENTITY_REFINEMENT_FLOW_ID || 'baf34a50-f8e6-474a-9664-9c57523766c7';
    this.codeGenerationFlowId = process.env.FLOWISE_CODE_GENERATION_FLOW_ID || '';
  }

  /**
   * Run a specific FlowiseAI flow
   * @param {string} flowId - The ID of the flow to run
   * @param {object} payload - Input data for the flow
   * @returns {Promise<object>} - Response from FlowiseAI
   */
  async runFlow(flowId, payload) {
    try {
      console.log(`Running FlowiseAI flow ${flowId} with data:`, payload);
      
      // Ensure payload has a question field as required by FlowiseAI
      const flowPayload = {
        ...payload,
        question: payload.question || `Generate data for ${Object.keys(payload).join(', ')}`
      };
      
      const response = await this.axios.post(`/api/v1/prediction/${flowId}`, flowPayload);
      console.log(`FlowiseAI response summary:`, typeof response.data);
      return response.data;
    } catch (error) {
      console.error('FlowiseAI API Error:', error.response?.data || error.message);
      throw new Error(`FlowiseAI API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Generate project description based on project name
   * @param {string} projectName - Name of the project
   * @returns {Promise<string>} - Generated project description
   */
  async generateDescription(projectName) {
    try {
      console.log('Calling FlowiseAI for project description:', projectName);
      
      const payload = {
        question: `Generate a detailed description for a ${projectName} project`,
        projectName: projectName
      };
      
      const result = await this.runFlow(this.descriptionFlowId, payload);
      return result;
    } catch (error) {
      console.error('Error generating description:', error);
      throw error;
    }
  }

  /**
   * Generate entities based on project name and description
   * @param {string} projectName - Name of the project
   * @param {string} projectDescription - Project description
   * @returns {Promise<object>} - Generated entities
   */
  async generateEntities(projectName, projectDescription) {
    try {
      console.log('Calling FlowiseAI for entity generation:', projectName);
      
      // Ensure we use the format expected by your flow
      const payload = {
        question: `Generate entities for ${projectName}`,
        project_name: projectName,
        project_description: projectDescription
      };
      
      const result = await this.runFlow(this.entityGenerationFlowId, payload);
      
      // If we get a string response, try to parse it as JSON
      if (typeof result === 'string') {
        try {
          return JSON.parse(result);
        } catch (parseError) {
          console.error('Error parsing FlowiseAI string response:', parseError);
          return { entities: [] };
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error generating entities:', error);
      throw error;
    }
  }
}

module.exports = new FlowiseClient();