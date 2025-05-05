const { PassThrough } = require("stream");
const FormData = require("form-data");

// Create your JSON object
const jsonData = {
  project_name: "Employee Management System",
  project_description: "A web-based application to manage employee records, including personal details, job roles, attendance, salary, and performance reviews. The system provides role-based access for administrators, HR personnel, and employees, with features like employee registration, leave management, and report generation."
};

// Convert JSON to string
const jsonString = JSON.stringify(jsonData, null, 2);

// Create a PassThrough stream with the JSON string
const stream = new PassThrough();
stream.end(jsonString); // Important: flush the stream to avoid 'Unexpected end of form'

// Create FormData
const formData = new FormData();
formData.append("files", stream, {
  filename: "data.json",
  contentType: "application/json"
});
formData.append("groqApiKey", "example");
formData.append("modelName", "example");
formData.append("temperature", "1");

// Function to send request
async function query(formData) {
  const response = await fetch(
    "http://localhost:3000/api/v1/prediction/bb6caff7-e079-43f7-99f7-02e7487e1ba3",
    {
      method: "POST",
      body: formData,
      headers: formData.getHeaders()
    }
  );

  const result = await response.json();
  return result;
}

// Run it
query(formData)
  .then((response) => console.log(response))
  .catch((err) => console.error("Error:", err));
