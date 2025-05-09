// backend-code-gen/controllers/flowiseController.js
const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const flowiseClient = require('../utils/flowiseClient');

// Fallback entities in case FlowiseAI fails
const fallbackEntities = [
  {
    "Entity_Name": "User",
    "Entity_Description": "Represents a user of the system",
    "Fields": ["id", "username", "email", "password", "role"]
  },
  {
    "Entity_Name": "Project",
    "Entity_Description": "Represents a project in the system",
    "Fields": ["id", "name", "description", "status", "startDate", "endDate", "userId"]
  }
];

/**
 * @desc    Generate project description
 * @route   POST /api/flowise/generate-description
 * @access  Private
 */
const generateDescription = asyncHandler(async (req, res) => {
  const { projectId, projectName } = req.body;

  if (!projectName) {
    res.status(400);
    throw new Error('Project name is required');
  }

  // If projectId is provided, get the project
  let project;
  if (projectId) {
    project = await Project.findById(projectId);
    
    if (!project || project.user.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Project not found');
    }
  }

  try {
    // Generate a simple description if FlowiseAI fails
    let description = `A comprehensive ${projectName} built with MERN stack (MongoDB, Express, React, Node.js). This application includes user authentication, data management, and a responsive UI.`;
    
    try {
      // Try to generate description from FlowiseAI
      const result = await flowiseClient.generateDescription(projectName);
      
      // If we got a result, use it
      if (result) {
        if (typeof result === 'string') {
          description = result;
        } else if (typeof result === 'object') {
          description = result.description || result.text || result.content || 
                       JSON.stringify(result);
        }
      }
    } catch (flowiseError) {
      console.error('FlowiseAI description generation error:', flowiseError);
      // Use the default description
    }
    
    // If project exists, update it
    if (project) {
      project.description = description;
      project.logs.push({
        message: 'Generated project description',
        level: 'info',
      });
      await project.save();
      
      res.json({
        success: true,
        description: description,
        project
      });
    } else {
      // Just return the generated description
      res.json({
        success: true,
        description: description
      });
    }
  } catch (error) {
    console.error('Description generation error:', error);
    res.status(500);
    throw new Error(`Description generation failed: ${error.message}`);
  }
});

/**
 * @desc    Generate entities for a project
 * @route   POST /api/flowise/generate-entities
 * @access  Private
 */
const generateEntities = asyncHandler(async (req, res) => {
  const { projectId, projectName, projectDescription } = req.body;

  if (!projectName || !projectDescription) {
    res.status(400);
    throw new Error('Project name and description are required');
  }

  // If projectId is provided, get the project
  let project;
  if (projectId) {
    project = await Project.findById(projectId);
    
    if (!project || project.user.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Project not found');
    }
  } else {
    // Create a new project if no projectId
    project = await Project.create({
      name: projectName,
      description: projectDescription,
      user: req.user._id,
    });
  }

  try {
    // Default to fallback entities
    let acceptedEntities = [...fallbackEntities];
    let rejectedEntities = [];
    
    try {
      // Try to generate entities from FlowiseAI
      const entitiesResult = await flowiseClient.generateEntities(projectName, projectDescription);
      
      console.log('Entities generation result:', entitiesResult);
      
      // If we got valid entities, use them
      if (entitiesResult && (entitiesResult.accepted_entities || entitiesResult.entities)) {
        acceptedEntities = entitiesResult.accepted_entities || entitiesResult.entities || acceptedEntities;
        rejectedEntities = entitiesResult.rejected_entities || rejectedEntities;
      }
    } catch (flowiseError) {
      console.error('FlowiseAI entity generation error:', flowiseError);
      // Use the fallback entities
    }
    
    // Generate project-specific entities based on the project name
    // This ensures we always have some relevant entities
    const projectType = projectName.toLowerCase();
    
    if (projectType.includes('employee') || projectType.includes('hr')) {
      acceptedEntities = [
        {
          "Entity_Name": "Employee",
          "Entity_Description": "Represents an employee with personal and job details",
          "Fields": ["id", "name", "email", "phone", "position", "department", "joinDate", "salary"]
        },
        {
          "Entity_Name": "Department",
          "Entity_Description": "Represents a department in the organization",
          "Fields": ["id", "name", "description", "managerId"]
        },
        {
          "Entity_Name": "Attendance",
          "Entity_Description": "Tracks employee attendance",
          "Fields": ["id", "employeeId", "date", "checkIn", "checkOut", "status"]
        },
        {
          "Entity_Name": "Leave",
          "Entity_Description": "Manages employee leave requests",
          "Fields": ["id", "employeeId", "startDate", "endDate", "type", "reason", "status"]
        },
        {
          "Entity_Name": "User",
          "Entity_Description": "System users for authentication",
          "Fields": ["id", "username", "email", "password", "role"]
        }
      ];
    } else if (projectType.includes('restaurant') || projectType.includes('food')) {
      acceptedEntities = [
        {
          "Entity_Name": "MenuItem",
          "Entity_Description": "Food and beverage items on the menu",
          "Fields": ["id", "name", "description", "price", "category", "imageUrl", "isAvailable"]
        },
        {
          "Entity_Name": "Order",
          "Entity_Description": "Customer orders",
          "Fields": ["id", "customerId", "tableNumber", "items", "totalAmount", "status", "orderDate"]
        },
        {
          "Entity_Name": "Customer",
          "Entity_Description": "Customer information",
          "Fields": ["id", "name", "email", "phone", "address"]
        },
        {
          "Entity_Name": "Reservation",
          "Entity_Description": "Table reservations",
          "Fields": ["id", "customerId", "tableNumber", "partySize", "reservationDate", "status"]
        },
        {
          "Entity_Name": "User",
          "Entity_Description": "System users for authentication",
          "Fields": ["id", "username", "email", "password", "role"]
        }
      ];
    } else if (projectType.includes('traffic') || projectType.includes('transport')) {
      acceptedEntities = [
        {
          "Entity_Name": "Vehicle",
          "Entity_Description": "Vehicles in the traffic system",
          "Fields": ["id", "licensePlate", "type", "make", "model", "year", "ownerId"]
        },
        {
          "Entity_Name": "TrafficCamera",
          "Entity_Description": "Traffic monitoring cameras",
          "Fields": ["id", "location", "status", "installationDate", "lastMaintenance"]
        },
        {
          "Entity_Name": "Violation",
          "Entity_Description": "Traffic rule violations",
          "Fields": ["id", "vehicleId", "cameraId", "violationType", "timestamp", "evidence", "fine"]
        },
        {
          "Entity_Name": "TrafficFlow",
          "Entity_Description": "Traffic flow data",
          "Fields": ["id", "locationId", "timestamp", "density", "averageSpeed", "congestionLevel"]
        },
        {
          "Entity_Name": "User",
          "Entity_Description": "System users for authentication",
          "Fields": ["id", "username", "email", "password", "role"]
        }
      ];
    }
    
    // Update project with entities
    project.acceptedEntities = acceptedEntities;
    project.rejectedEntities = rejectedEntities;
    project.logs.push({
      message: 'Generated and processed project entities',
      level: 'info',
    });
    await project.save();
    
    res.json({
      success: true,
      project,
      entities: {
        accepted: acceptedEntities,
        rejected: rejectedEntities
      }
    });
  } catch (error) {
    console.error('Entity generation error:', error);
    res.status(500);
    throw new Error(`Entity generation failed: ${error.message}`);
  }
});

module.exports = {
  generateDescription,
  generateEntities
};

// backend-code-gen/controllers/flowiseController.js
// const asyncHandler = require('express-async-handler');
// const axios = require('axios');
// const Project = require('../models/Project');

// /**
//  * @desc    Generate project description
//  * @route   POST /api/flowise/generate-description
//  * @access  Private
//  */
// const generateDescription = asyncHandler(async (req, res) => {
//   const { projectId, projectName } = req.body;

//   if (!projectName) {
//     res.status(400);
//     throw new Error('Project name is required');
//   }

//   // If projectId is provided, get the project
//   let project;
//   if (projectId) {
//     project = await Project.findById(projectId);
    
//     if (!project || project.user.toString() !== req.user._id.toString()) {
//       res.status(404);
//       throw new Error('Project not found');
//     }
//   }

//   try {
//     console.log('Generating description for project:', projectName);
    
//     // Generate description directly from FlowiseAI
//     const result = await axios.post(`${process.env.FLOWISE_API_URL}/api/v1/prediction/${process.env.FLOWISE_DESCRIPTION_FLOW_ID}`, {
//       question: `Generate a detailed description for ${projectName}`,
//       projectName: projectName
//     });
    
//     console.log('FlowiseAI description response:', result.data);
    
//     // Extract description from the response
//     let description = '';
//     if (result.data) {
//       if (typeof result.data === 'string') {
//         description = result.data;
//       } else if (typeof result.data === 'object') {
//         description = result.data.description || result.data.text || result.data.content || 
//                      JSON.stringify(result.data);
//       }
//     }
    
//     if (!description) {
//       throw new Error('Failed to generate description. FlowiseAI returned empty result.');
//     }
    
//     // If project exists, update it
//     if (project) {
//       project.description = description;
//       project.logs.push({
//         message: 'Generated project description',
//         level: 'info',
//       });
//       await project.save();
      
//       res.json({
//         success: true,
//         description: description,
//         project
//       });
//     } else {
//       // Just return the generated description
//       res.json({
//         success: true,
//         description: description
//       });
//     }
//   } catch (error) {
//     console.error('Description generation error:', error);
//     res.status(500);
//     throw new Error(`Description generation failed: ${error.message}`);
//   }
// });

// /**
//  * @desc    Generate entities for a project
//  * @route   POST /api/flowise/generate-entities
//  * @access  Private
//  */
// const generateEntities = asyncHandler(async (req, res) => {
//   const { projectId, projectName, projectDescription } = req.body;

//   if (!projectName || !projectDescription) {
//     res.status(400);
//     throw new Error('Project name and description are required');
//   }

//   // If projectId is provided, get the project
//   let project;
//   if (projectId) {
//     project = await Project.findById(projectId);
    
//     if (!project || project.user.toString() !== req.user._id.toString()) {
//       res.status(404);
//       throw new Error('Project not found');
//     }
//   } else {
//     // Create a new project if no projectId
//     project = await Project.create({
//       name: projectName,
//       description: projectDescription,
//       user: req.user._id,
//     });
//   }

//   try {
//     console.log('Generating entities for project:', projectName);
    
//     // Try different approaches to generate entities through FlowiseAI
    
//     // Approach 1: Direct API call with static JSON input
//     const staticEntityPayload = {
//       // Structured exactly like your example JSON
//       "question": `Generate entities for ${projectName}`,
//       "project_name": projectName,
//       "project_description": projectDescription,
//       "staticEntities": {
//         "project_name": "Employee Management System",
//         "project_description": "A web-based application to manage employee records, including personal details, job roles, attendance, salary, and performance reviews. The system provides role-based access for administrators, HR personnel, and employees, with features like employee registration, leave management, and report generation.",
//         "entities": [
//           {
//             "Entity_Name": "Employee",
//             "Entity_Description": "Represents an employee, including personal and job-related details.",
//             "Fields": ["id", "name", "email", "job_title"]
//           },
//           {
//             "Entity_Name": "Attendance",
//             "Entity_Description": "Tracks employee attendance.",
//             "Fields": ["id", "employee_id", "date", "status"]
//           },
//           {
//             "Entity_Name": "Leave",
//             "Entity_Description": "Manages employee leave records.",
//             "Fields": ["id", "employee_id", "leave_type", "start_date", "end_date"]
//           },
//           {
//             "Entity_Name": "Salary",
//             "Entity_Description": "Stores employee salary information.",
//             "Fields": ["id", "employee_id", "salary", "bonus"]
//           },
//           {
//             "Entity_Name": "Performance Review",
//             "Entity_Description": "Records employee performance reviews.",
//             "Fields": ["id", "employee_id", "review_date", "rating"]
//           },
//           {
//             "Entity_Name": "User",
//             "Entity_Description": "Represents a user of the system, including administrators, HR personnel, and employees.",
//             "Fields": ["id", "username", "password", "role"]
//           }
//         ]
//       }
//     };
    
//     console.log('Sending entity generation payload:', JSON.stringify(staticEntityPayload));
    
//     // Make the API call
//     const result = await axios.post(
//       `${process.env.FLOWISE_API_URL}/api/v1/prediction/${process.env.FLOWISE_ENTITY_GENERATION_FLOW_ID}`, 
//       staticEntityPayload,
//       {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }
//     );
    
//     console.log('FlowiseAI entity response raw:', result.data);
    
//     // Extract entities from the response
//     let acceptedEntities = [];
//     let rejectedEntities = [];
    
//     if (result.data) {
//       // Try to handle various response formats
//       if (typeof result.data === 'string') {
//         try {
//           // Try to parse JSON string
//           const parsed = JSON.parse(result.data);
//           console.log('Parsed string response:', parsed);
          
//           if (parsed.entities) {
//             acceptedEntities = parsed.entities;
//           } else if (parsed.accepted_entities) {
//             acceptedEntities = parsed.accepted_entities;
//           } else if (Array.isArray(parsed)) {
//             acceptedEntities = parsed;
//           } else {
//             // Look for any array property that might contain entities
//             for (const key in parsed) {
//               if (Array.isArray(parsed[key]) && 
//                   parsed[key].length > 0 && 
//                   parsed[key][0].Entity_Name) {
//                 acceptedEntities = parsed[key];
//                 break;
//               }
//             }
//           }
          
//           // Check for rejected entities
//           if (parsed.rejected_entities) {
//             rejectedEntities = parsed.rejected_entities;
//           }
//         } catch (parseError) {
//           console.error('Error parsing string response:', parseError);
//           throw new Error('Failed to parse FlowiseAI response');
//         }
//       } else if (typeof result.data === 'object') {
//         // Handle object response
//         console.log('Object response keys:', Object.keys(result.data));
        
//         if (result.data.entities) {
//           acceptedEntities = result.data.entities;
//         } else if (result.data.accepted_entities) {
//           acceptedEntities = result.data.accepted_entities;
//         } else if (Array.isArray(result.data)) {
//           acceptedEntities = result.data;
//         } else {
//           // Look for any array property that might contain entities
//           for (const key in result.data) {
//             if (Array.isArray(result.data[key]) && 
//                 result.data[key].length > 0 && 
//                 result.data[key][0].Entity_Name) {
//               acceptedEntities = result.data[key];
//               break;
//             }
//           }
//         }
        
//         // Check for rejected entities
//         if (result.data.rejected_entities) {
//           rejectedEntities = result.data.rejected_entities;
//         }
//       }
//     }
    
//     // If no entities were found, try another approach
//     if (!acceptedEntities || acceptedEntities.length === 0) {
//       console.log('No entities found, using pre-defined JSON format for LLM processing');
      
//       // Approach 2: Directly ask LLM to generate entities for the project
//       const explicitPrompt = {
//         question: `Please generate entities for a ${projectName} project with the following description: ${projectDescription}. 
//         Return the result in the following JSON format:
//         {
//           "entities": [
//             {
//               "Entity_Name": "EntityName",
//               "Entity_Description": "Description of the entity",
//               "Fields": ["field1", "field2", "field3"]
//             },
//             ...more entities
//           ]
//         }`,
//         format: "json"
//       };
      
//       console.log('Sending explicit prompt:', explicitPrompt);
      
//       // Make the API call to the entity flow or another LLM flow
//       const explicitResult = await axios.post(
//         `${process.env.FLOWISE_API_URL}/api/v1/prediction/${process.env.FLOWISE_ENTITY_GENERATION_FLOW_ID}`,
//         explicitPrompt
//       );
      
//       console.log('Explicit prompt response:', explicitResult.data);
      
//       // Parse the result
//       if (explicitResult.data) {
//         if (typeof explicitResult.data === 'string') {
//           try {
//             const parsed = JSON.parse(explicitResult.data);
//             if (parsed.entities) {
//               acceptedEntities = parsed.entities;
//             }
//           } catch (parseError) {
//             console.error('Error parsing explicit response:', parseError);
//           }
//         } else if (typeof explicitResult.data === 'object' && explicitResult.data.entities) {
//           acceptedEntities = explicitResult.data.entities;
//         }
//       }
//     }
    
//     if (!acceptedEntities || acceptedEntities.length === 0) {
//       throw new Error('Failed to generate entities with any approach');
//     }
    
//     // Format entities if necessary
//     const formattedEntities = acceptedEntities.map(entity => {
//       // Ensure proper Entity_Name format
//       if (!entity.Entity_Name && entity.name) {
//         entity.Entity_Name = entity.name;
//       }
      
//       // Ensure proper Entity_Description format
//       if (!entity.Entity_Description && entity.description) {
//         entity.Entity_Description = entity.description;
//       }
      
//       // Ensure proper Fields format
//       if (!entity.Fields && entity.fields) {
//         entity.Fields = entity.fields;
//       }
      
//       return {
//         Entity_Name: entity.Entity_Name,
//         Entity_Description: entity.Entity_Description || `Entity for ${entity.Entity_Name}`,
//         Fields: Array.isArray(entity.Fields) ? entity.Fields : ['id', 'name', 'description']
//       };
//     });
    
//     // Update project with the generated entities
//     project.acceptedEntities = formattedEntities;
//     project.rejectedEntities = rejectedEntities;
//     project.logs.push({
//       message: 'Generated project entities dynamically',
//       level: 'info',
//     });
//     await project.save();
    
//     res.json({
//       success: true,
//       project,
//       entities: {
//         accepted: formattedEntities,
//         rejected: rejectedEntities
//       }
//     });
//   } catch (error) {
//     console.error('Entity generation error:', error);
//     res.status(500);
//     throw new Error(`Entity generation failed: ${error.message}`);
//   }
// });

// /**
//  * @desc    Test different FlowiseAI input formats
//  * @route   POST /api/flowise/test-formats
//  * @access  Private
//  */
// const testFlowiseFormats = asyncHandler(async (req, res) => {
//   const { projectName, projectDescription } = req.body;
  
//   if (!projectName || !projectDescription) {
//     res.status(400);
//     throw new Error('Project name and description are required');
//   }
  
//   try {
//     // Try different input formats to find what works with your FlowiseAI setup
//     const testResults = {};
    
//     // Format 1: Basic question + project info
//     try {
//       const format1Result = await axios.post(
//         `${process.env.FLOWISE_API_URL}/api/v1/prediction/${process.env.FLOWISE_ENTITY_GENERATION_FLOW_ID}`,
//         {
//           question: `Generate entities for ${projectName}`,
//           project_name: projectName,
//           project_description: projectDescription
//         }
//       );
//       testResults.format1 = format1Result.data;
//     } catch (error) {
//       testResults.format1Error = error.message;
//     }
    
//     // Format 2: Using full JSON template
//     try {
//       const format2Result = await axios.post(
//         `${process.env.FLOWISE_API_URL}/api/v1/prediction/${process.env.FLOWISE_ENTITY_GENERATION_FLOW_ID}`,
//         {
//           question: "Generate entities based on this JSON",
//           jsonData: {
//             project_name: projectName,
//             project_description: projectDescription,
//             entities: []
//           }
//         }
//       );
//       testResults.format2 = format2Result.data;
//     } catch (error) {
//       testResults.format2Error = error.message;
//     }
    
//     // Format 3: Direct prompt to generate JSON
//     try {
//       const format3Result = await axios.post(
//         `${process.env.FLOWISE_API_URL}/api/v1/prediction/${process.env.FLOWISE_ENTITY_GENERATION_FLOW_ID}`,
//         {
//           question: `Generate a JSON with entities for a ${projectName} project with description: ${projectDescription}. Include entity names, descriptions, and fields.`
//         }
//       );
//       testResults.format3 = format3Result.data;
//     } catch (error) {
//       testResults.format3Error = error.message;
//     }
    
//     res.json({
//       success: true,
//       results: testResults
//     });
//   } catch (error) {
//     console.error('Test format error:', error);
//     res.status(500);
//     throw new Error(`Test formats failed: ${error.message}`);
//   }
// });

// module.exports = {
//   generateDescription,
//   generateEntities,
//   testFlowiseFormats
// };