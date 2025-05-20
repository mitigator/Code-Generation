# Project Setup Guide

This repository contains both client and server components that need to be set up separately.

## Installation and Setup

### Prerequisites
- Node.js and npm installed
- Git installed

### Setup Steps

1. **Clone the repository**
   ```
   git clone https://github.com/mitigator/Code-Generation.git
   ```

2. **Client Setup**
   ```
   cd client
   npm install
   npm run dev
   ```

3. **Server Setup** (in a new terminal)
   ```
   cd server
   npm install
   npm start
   ```

4. **Configuration**
   - Open the `.env` file in the project root
   - Update the Flowise URL with your local Chatflow URL

## Important Notes
- Make sure both client and server are running simultaneously
- The client runs on the default development port ( 5173 depending on the framework)
- The server runs on port 5000 (check console output for confirmation)

## Troubleshooting
- If you encounter any issues with dependencies, make sure you have the latest version of npm installed
- Check that all environment variables are correctly set in the `.env` file
- Make sure ports required by the application are not being used by other services
