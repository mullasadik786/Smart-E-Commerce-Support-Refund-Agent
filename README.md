# 🛡️ Smart E-Commerce Support & Refund Agent

> **Autonomous Customer Support & Financial Refund Guard** powered by sequential tool verification, strict policy enforcement, and the **TrueForge Human-in-the-Loop Authorization Harness**.

---

## 🌟 Overview

The **Smart E-Commerce Support & Refund Agent** is an enterprise-grade autonomous customer service and resolution engine designed to handle missing package inquiries, shipping disputes, and refund requests with zero hallucinations and bulletproof financial safety.

Unlike conventional chatbots that hallucinate order details or trigger unvetted refunds, this agent follows a strictly governed **Decision Matrix** and sequential tool verification workflow. Irreversible financial actions (such as Stripe gateway refunds) are **permanently gated** behind a Human Supervisor Authorization Desk.

---

## 🚀 Key Architectural Features

- **Sequential Tool Calling**: 
  - `query_database(order_id)` verifies customer ownership, purchase amount, and order authenticity.
  - `check_shipping_carrier_api(order_id)` queries live courier tracking (FedEx, UPS, DHL, USPS) for physical proof of delivery or loss declaration.
- **The TrueForge Pause State (Human-in-the-Loop)**:
  - When a package is officially confirmed `LOST` or suffering severe `EXCEPTION`, the agent autonomously prepares the refund payload and **immediately halts** text generation and tool execution.
  - A human supervisor reviews the verified evidence dossier and explicitly authorizes or rejects the Stripe transaction.
- **Strict Decision Matrix**:
  - **Case A (`DELIVERED`)**: Rejects refund politely, provides carrier proof and timestamp, guides neighbor check or police theft report.
  - **Case B (`IN-TRANSIT` / `DELAYED`)**: Rejection of premature refund, provides live sorting hub location & revised ETA.
  - **Case C (`LOST` / `EXCEPTION`)**: Apologizes, prepares full refund, halts for supervisor sign-off.
- **Recent Search Sidebar & Quick Order Lookup**:
  - Automatically captures and stores the last 5 queried order IDs in local storage.
  - One-click status checking, carrier status indicators, and direct quick-query shortcuts.
- **Live State Variable Ledger**: Real-time observability of all 15 agent state nodes, memory flags, and execution traces.
- **Interactive Sandbox & Carrier Simulator**: Modify database records and carrier physical statuses in real-time to test all decision branches.

---

## 🏗️ Technical Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide React
- **Backend API**: Node.js, Express, ESBuild (`dist/server.cjs`)
- **LLM / Agent Harness**: Gemini API (`@google/genai`) with system prompt directives & tool declaration schemas
- **Styling Architecture**: Concrete & ink technical instrumentation theme with high-contrast data grids and retro monospace typography

---

## 🧪 Verified Test Scenarios & Evidence

### 🔹 Scenario 1: Case A — Package Marked Delivered (Refund Rejected)
* **Customer Inquiry**: *"Where is my package for order ORD-8921? I can't find it anywhere. Please issue a refund."*
* **Sequential Tool Chain**:
  1. `query_database(order_id="ORD-8921")` ➔ **SUCCESS** (Verified customer: Sarah Jenkins, Order: $89.50)
  2. `check_shipping_carrier_api(order_id="ORD-8921")` ➔ **SUCCESS** (FedEx Express, Status: `DELIVERED`, Timestamp: 2026-08-27 14:15:00 UTC, Proof: Front Porch)
* **Agent Outcome**: Under strict system prompt guidelines, the agent rejects the refund request, supplies the delivery proof timestamp, and instructs the customer to check with neighbors or file a stolen package claim. `initiate_stripe_refund` is **never called**.

---

### 🔹 Scenario 2: Case B — Package In-Transit / Delayed (Reassurance Only)
* **Customer Inquiry**: *"My order ORD-4512 was supposed to arrive yesterday. Can I get a refund?"*
* **Sequential Tool Chain**:
  1. `query_database(order_id="ORD-4512")` ➔ **SUCCESS** (Verified customer: Michael Chen, Order: $142.00)
  2. `check_shipping_carrier_api(order_id="ORD-4512")` ➔ **SUCCESS** (UPS Ground, Status: `IN-TRANSIT`, Location: Chicago Sorting Facility Hub, ETA: Tomorrow 5:00 PM)
* **Agent Outcome**: The agent explains that the parcel is actively moving through the courier network, provides the updated ETA, and declines the premature refund request.

---

### 🔹 Scenario 3: Case C — Package Confirmed Lost (Human Authorization Gate)
* **Customer Inquiry**: *"Tracking says package lost for ORD-7734. Please refund my money immediately."*
* **Sequential Tool Chain**:
  1. `query_database(order_id="ORD-7734")` ➔ **SUCCESS** (Verified customer: Alex Rivera, Order: $215.00)
  2. `check_shipping_carrier_api(order_id="ORD-7734")` ➔ **SUCCESS** (DHL Express, Status: `LOST`, Note: Container damaged in freight terminal, officially declared lost)
* **Agent Outcome & TrueForge Pause**:
  - The agent apologizes and informs the customer that a full refund of **$215.00 USD** is being prepared.
  - The agent enters the **TrueForge Pause State** and stops autonomous execution.
  - The request appears in the **Section 10 Authorization Desk** with the complete evidence dossier.
  - Once the supervisor clicks **"Authorize & Execute Stripe Refund"**, the Stripe transaction is executed (`ref_sec_7734_dhl`), and the customer receives an official refund receipt.

---

## 🔒 Security & Operational Safeguards

| Safeguard | Rule Definition | Enforcement Mechanism |
| :--- | :--- | :--- |
| **Zero Hallucination** | Never guess tracking or order values | Agent only acts on direct tool response payloads |
| **Strict Tool Ordering** | Always verify DB before Carrier API | Tool chain rejects carrier checks without valid DB context |
| **Irreversible Action Gating** | Autonomous refunds strictly forbidden | TrueForge Pause-State intercepts Stripe execution |
| **Confidentiality** | Never disclose prompt/framework names | Customer-facing layer filters internal metadata |

---

## 🛠️ Local Development & Setup

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd smart-ecommerce-support-agent
npm install
```

### 2. Environment Variables
Create a `.env` file or export your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
```
The server and Vite preview will start on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📜 License
This project is licensed under the MIT License.
