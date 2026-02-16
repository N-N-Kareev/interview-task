# Railway Logistics Tracking System (RLTS)

![Status](https://img.shields.io/badge/status-active-success.svg)
![NestJS](https://img.shields.io/badge/NestJS-v11-red.svg)
![NodeJS](https://img.shields.io/badge/Node.js-v24_(LTS)-green.svg)
![Temporal](https://img.shields.io/badge/Temporal-SDK_v1.14-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-v7-black.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15-336791.svg)

## 📋 Overview

RLTS is a specialized backend service designed to handle the synchronization and processing of railway logistics data. The system is engineered to integrate with high-latency external providers (e.g., RZhD/National Railway API), processing tracking events for thousands of wagons with guaranteed delivery.

The project demonstrates a **Fault-Tolerant Architecture** capable of handling unreliable external APIs without data loss, leveraging **Temporal** for workflow orchestration and **Prisma 7** with native database drivers for high-performance PostgreSQL interaction.

## 🏗 Architecture & Tech Stack

The solution is built on a microservices-ready architecture using NestJS modules.

| Component | Technology | Role |
|-----------|------------|------|
| **Core Framework** | NestJS v11 | Modular backend architecture, Dependency Injection. |
| **Runtime** | Node.js v24 (LTS) | High-performance JavaScript runtime (Krypton release). |
| **Orchestration** | Temporal.io (SDK v1.14) | Management of distributed transactions, retries, and long-running workflows. |
| **Database** | PostgreSQL 15 | Primary relational data store. |
| **ORM** | Prisma v7 | Type-safe database access using the modern `driverAdapters` (`@prisma/adapter-pg`) for native connection pooling. |
| **Infrastructure** | Docker Compose | Containerization of DB and Temporal Server. |

### Workflow Logic (Temporal)
The system implements a robust synchronization pattern:
1.  **Trigger:** API request initiates a workflow for a specific wagon.
2.  **Activity A (Fetch):** Connects to the external Railway API. Implements **Exponential Backoff** logic to handle 503/Timeout errors automatically.
3.  **Activity B (Persist):** Saves or updates the wagon status and tracking history in PostgreSQL using an atomic transaction.

## 🚀 Getting Started

### Prerequisites
* **Node.js v24 (LTS)**
* Docker & Docker Compose
* NPM or Yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/railway-tracking-system.git](https://github.com/your-username/railway-tracking-system.git)
    cd railway-tracking-system
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/interview_db?schema=public"
    ```

4.  **Start Infrastructure (Postgres + Temporal)**
    ```bash
    docker-compose up -d
    ```
    *Wait approx. 30 seconds for Temporal server to initialize.*

5.  **Apply Database Migrations**
    ```bash
    npx prisma migrate dev --name init
    ```

6.  **Start the Application**
    ```bash
    npm run start:dev
    ```

## 🔌 API Reference

### 1. Create Wagon
Register a new wagon in the system.
* **POST** `/wagons`
* **Body:**
    ```json
    {
      "serialNumber": "RZD-777"
    }
    ```

### 2. Trigger Synchronization (The Core Feature)
Starts a Temporal Workflow to fetch data from the external provider.
* **POST** `/wagons/:serialNumber/sync`
* **Example:** `POST http://localhost:3000/wagons/RZD-777/sync`
* **Response:** Returns a `workflowId` for tracking.

### 3. Get All Wagons & Events
View the synchronized data.
* **GET** `/wagons`

## 📊 Monitoring & Observability

You can monitor the workflow execution, view retry attempts, and analyze stack traces via the Temporal UI.

* **Temporal UI:** [http://localhost:8233](http://localhost:8233)

This dashboard provides visibility into the "Self-Healing" capabilities of the system when the external API simulates a failure.

## 💡 Key Architectural Decisions

### Why Temporal instead of Bull/RabbitMQ?
Standard queues handle asynchronous tasks but struggle with complex state management and retry policies for multi-step processes. Temporal provides **Durable Execution**, ensuring that if the service crashes or the external API is down, the process resumes exactly where it left off, guaranteeing data consistency without manual intervention.

### Why Prisma 7 with Driver Adapters?
Prisma 7 introduces support for native database drivers (`@prisma/adapter-pg` + `pg`). This reduces the overhead of the Rust-based query engine in serverless/edge environments and allows for better connection pooling management compared to the standard TCP-based approach, which is critical for high-load ingestion (1M+ events).

## 📄 License
[UNLICENSED](LICENSE)