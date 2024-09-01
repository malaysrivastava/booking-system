import { Sequelize } from 'sequelize';
require('dotenv').config();



// Create a function to initialize the Sequelize connection
const initializeSequelize = () => {
    const sequelize = new Sequelize({
        username: process.env.DB_USERNAME,  // Your database username
        password: process.env.DB_PASSWORD,  // Your database password
        database: process.env.DB_DATABASE,  // Your database name
        host: process.env.DB_HOST,          // Your database host
        dialect: 'postgres',                // The database dialect (postgres)
        port: Number(process.env.DB_PORT),  // Your database port
        dialectOptions: {
            ssl: {
                require: true, // This will enforce SSL connection
                rejectUnauthorized: true, // For self-signed certificates
                ca: process.env.DB_CA_CERTIFICATE
            },
        },
        logging: false, // Disable logging for a cleaner console output
    });

    return sequelize;
};

// Initialize the Sequelize instance
const sequelize = initializeSequelize();

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

export default sequelize;
