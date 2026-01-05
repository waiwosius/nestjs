# NestJS Backend API

This is a backend API built with **NestJS**.

## Prerequisites

This project requires specific versions of Node.js and npm to ensure compatibility:

- **Node.js**: `>=20.0.0`
- **npm**: `>=10.0.0`

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

## Environment Variables

Create a `.env` file in the root directory and define the required variables.  
Refer to `.env.example` for an example of the expected structure and variable names.

## Running the Application

Start the application in development mode:

```bash
npm run start:dev
```

The server will be accessible at http://localhost:3000 by default.

## Running Tests

- End-to-End (e2e) Tests

```bash
npm run test:e2e
```

- Unit Tests

```bash
npm run test
```