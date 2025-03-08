# KIO Chatbot AI Assistant

This project is an AI-driven chatbot equipped with an integrated knowledge base. It assists users by utilizing a local embedding generator and a knowledge base to process queries efficiently.

Currently, the chatbot employs an in-memory database for vector storage and performs real-time vector searches.

Additionally, it leverages Hugging Face's `transformers.js` library to generate relevant responses.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [License](#license)

## Installation

### Clone the repository:
```sh
git clone <repository-url>
cd kio
```

### Install the dependencies:
```sh
npm install
```

### Setup Environment Variables
Create a `.env` file in the root directory and add the necessary environment variables (see [Environment Variables](#environment-variables)).

## Usage

### Running Service
To start the projec, run:
```sh
npm run start
```

To build the client (Chatbot UI)
```sh
npm run build-client
```

To build the client (Chatbot UI) and start the server:
```sh
npm run dev
```


## Environment Variables
Create a `.env` file in the root directory and add the following environment variables:
```ini
environment=development
KNOWLEDGE_BASE_PATH=knowledgebase
DATA_PATH=data/
CLIENTS_FILE_PATH=data/clients.json
EMBEDDING_GENERATOR=LOCAL
CONFIG_DATABASE=LOCAL
```

## Scripts
- `npm run build-client`: Builds the client-side code.
- `npm start`: Starts the server.
- `npm run dev`: Builds the client-side code and starts the server in development mode.

## Demo
Once the backend service is running successfully, you can access the demo page at [http://localhost:5000](http://localhost:5000).


## License
This project is licensed under the GNU GENERAL PUBLIC LICENSE License.