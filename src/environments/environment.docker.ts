import { API_PATH } from "./global";

export const environment = {
    fakeData: false,
    apiUrl: 'http://localhost:8090',  // API Gateway (accessible depuis le navigateur via le port exposé)
    gatewayUrl: 'http://localhost:8090',
    
    // Reclamation service endpoints
    reclamationBaseUrl: 'http://localhost:8090/reclamation/reclamations',
    reclamationBaseUrlCandidates: [
        'http://localhost:8090/reclamation/reclamations',
        'http://localhost:8090/reclamation/api/reclamations'
    ],

    // Candidate endpoints for exchanging Symfony token → gateway-valid token
    tokenExchangeUrl: 'http://localhost:8090/user-service/api/token/exchange',
    tokenExchangeUrlCandidates: [
        'http://localhost:8090/user-service/api/token/exchange',
        '/api/token/exchange'
    ],

    production: true,
    stripePublishableKey: 'pk_test_51Qx4HqRtzrEMIcCeoHynfwxOuuMqaZcnnOvcTXiXbTYDUpyLlO4Dcs5PcaZ9b1PRAZ7fkOlhMAqVw98niOq3JK0c005qpUhFzy',
    path: API_PATH
}
