## PM2 Elasticsearch metrics and logs shipper

### Introduction
A server which sends current running pm2 processes metrics as well as logs to elasticsearch

### Getting Started
1. Take care of dependencies
    ```sh
    npm i
    ```
2. Configurations: *create `.env` file in root dir*, 
    > For config examples refer `.env.example`
3. Start the server
    ```sh
    npm run start
    ```