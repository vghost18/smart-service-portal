Smart Service Request Portal (SSRP)

🚀 Overview

The Smart Service Request Portal is an enterprise-grade facility management solution built on a decoupled microservices architecture. Designed for university and corporate environments, it streamlines service ticket lifecycles through automated intelligence and secure inter-service communication.

Unlike monolithic legacy applications, SSRP utilizes a Backend-for-Frontend (BFF) pattern via an API Gateway to handle service orchestration, ensuring high availability and independent scalability of business logic.

🏗️ System Architecture

The system is partitioned into four distinct technical layers:

1. API Gateway (Reverse Proxy)

Role: Acts as the single entry point for the client-side application.

Logic: Utilizes http-proxy-middleware to route traffic to specific micro-nodes based on URL context (/auth/* or /requests/*), abstracting the internal network complexity from the frontend.

2. Authentication Service
Role: The Identity Provider (IdP).

Logic: Implements stateless authentication by generating Base64-encoded identity tokens. It provides a synchronous /validate endpoint for peers to verify token integrity and retrieve Role-Based Access Control (RBAC) claims.

3. Request Service

Role: Core Business Logic Engine.

Logic: Manages the CRUD lifecycle of service tickets.

Inter-service Communication: Employs Axios to perform real-time, synchronous token validation against the Auth Service before executing any state-changing operations.

4. Frontend UI

Stack: React 18 + Tailwind CSS.

UX Pattern: Features a modern Glassmorphism aesthetic. Implements client-side RBAC to toggle administrative controls (e.g., status/priority updates) based on the authenticated user's claims.

🛰️ Automated word token Engine

The Request Service contains an integrated keyword detection engine that utilizes Regular Expressions (Regex) to scan incoming request payloads:

Smart Categorization: Automatically routes tickets to IT, Facilities, or Admin by analyzing the title and description for specific intent keywords.

Predictive Priority: Detects urgency markers (e.g., "urgent", "critical") to auto-escalate ticket priority to High if the user leaves the field as "Auto Detect".

🔐 Role-Based Access Control (RBAC)

Student/Employee Role: Restricted to ticket creation and personal view. Administrative controls are purged from the DOM and blocked at the API level.

Support Team Role: Granted elevated privileges to modify ticket statuses (Open → In Progress → Resolved) and update ticket priorities via a dynamic administrative dropdown.

1. Installation

Clone the repository and install dependencies for each service:

# Clone the repository
git clone https://github.com/vghost18/smart-service-portal.git
cd smart-service-portal

# Install for Gateway
cd api-gateway && npm install

# Install for Auth Service
cd ../auth-service && npm install

# Install for Request Service
cd ../request-service && npm install express axios

# Install for Frontend
cd ../frontend && npm install


2. Execution

Run each service in a separate terminal instance:

API Gateway: node api-gateway/index.js

Auth Service: node auth-service/index.js

Request Service: node request-service/index.js

Frontend: cd frontend && npm start

📁 Repository Structure

smart-service-portal/
├── api-gateway/     
├── auth-service/     
├── request-service/  
├── frontend/         
└── README.md         
