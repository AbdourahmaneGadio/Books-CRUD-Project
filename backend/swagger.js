const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Books CRUD API Doc',
            version: '1.0.0',
            description: 'Documentation de l\'API avec Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3001', // Remplacez par l'URL de votre API
            },
        ],
    },
    apis: ['./index.js'], // Chemin vers vos fichiers contenant les routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
