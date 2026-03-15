try {
  const response = await axios.post('https://www.buyechelon.com/api/consumer/signup', {
    email: email,
    // Sending both common naming conventions
    name: "Agent Handshake",      // Some versions want a full name string
    firstName: "Agent",           // Standard CamelCase
    lastName: "Handshake",
    first_name: "Agent",          // Standard snake_case
    last_name: "Handshake",
    password: "ProvisioningAgent2026!",
    confirmPassword: "ProvisioningAgent2026!"
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response.data),
  };
} catch (error: any) {
  // ... (keep the rest of the error handling as is)
}
