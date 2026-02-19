Smart Service Request Portal (SSRP)
🚀 Overview

Smart Service Request Portal (SSRP) is an enterprise-grade facility management system built on a decoupled microservices architecture.

Designed for university and corporate environments, SSRP streamlines service ticket lifecycles using automated intelligence and secure inter-service communication.

Unlike traditional monolithic systems, SSRP follows a Backend-for-Frontend (BFF) architecture through an API Gateway that orchestrates services, enabling:

Independent scalability

High availability

Loose coupling between services

Secure service-to-service validation

🏗️ System Architecture

The system is divided into four technical layers:

1️⃣ API Gateway (Reverse Proxy)

Role: Single entry point for all client requests.

Responsibilities:

Routes traffic based on URL context (/auth/*, /requests/*)

Abstracts internal microservice network

Uses http-proxy-middleware for service routing

2️⃣ Authentication Service (Identity Provider)

Role: Stateless Identity Provider (IdP)

Responsibilities:

Generates Base64-encoded identity tokens

Provides synchronous /validate endpoint

Returns Role-Based Access Control (RBAC) claims

Ensures secure inter-service verification

3️⃣ Request Service (Core Business Logic Engine)

Role: Manages service ticket lifecycle

Responsibilities:

CRUD operations on tickets

Real-time token validation via Axios before state changes

Business rule enforcement

4️⃣ Frontend UI

Tech Stack:

React 18

Tailwind CSS

Features:

Glassmorphism UI design

Client-side RBAC enforcement

Dynamic admin controls based on user role

🛰️ Automated Keyword Token Engine

Integrated inside the Request Service.

Smart Categorization

Uses Regular Expressions (Regex) to:

Analyze title and description

Auto-route tickets to:

IT

Facilities

Admin

Predictive Priority

Detects urgency keywords like:

urgent

critical

asap

If priority is set to "Auto Detect", it automatically escalates to High.

🔐 Role-Based Access Control (RBAC)
👤 Student / Employee

Create tickets

View personal tickets only

No admin controls (blocked at UI + API level)

🛠️ Support Team

Modify ticket status (Open → In Progress → Resolved)

Update ticket priority

Access administrative dropdown controls

🛠️ Installation
1️⃣ Clone the Repository
git clone https://github.com/vghost18/smart-service-portal.git
cd smart-service-portal
2️⃣ Install Dependencies
API Gateway
cd api-gateway
npm install
Authentication Service
cd ../auth-service
npm install
Request Service
cd ../request-service
npm install express axios
Frontend
cd ../frontend
npm install
▶️ Execution

Run each service in a separate terminal window.

API Gateway
node api-gateway/index.js
Authentication Service
node auth-service/index.js
Request Service
node request-service/index.js
Frontend
cd frontend
npm start
📁 Repository Structure
smart-service-portal/
│
├── api-gateway/
├── auth-service/
├── request-service/
├── frontend/
└── README.md
