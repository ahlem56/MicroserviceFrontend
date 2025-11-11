import { API_PATH } from "./global";

export const environment = {
    fakeData : false,
  apiUrl: 'http://localhost:8084',  // Symfony User microservice
  gatewayUrl: 'http://localhost:8090',
  // Dev: go through Angular proxy to avoid CORS: '/reclamations'
  reclamationBaseUrl: '/reclamations',
  // Optional fallback candidates for dynamic detection if one path 404s
  reclamationBaseUrlCandidates: [
    '/reclamations',
    '/api/reclamations'
  ],
  // User-service endpoint (through dev proxy) to exchange Symfony token -> gateway-valid token
  tokenExchangeUrl: '/api/token/exchange',
  tokenExchangeUrlCandidates: [
    '/api/token/exchange', // dev proxy → /user-service/api/token/exchange
    'http://localhost:8090/user-service/api/token/exchange' // gateway direct
  ],
    production: false,
    stripePublishableKey: 'pk_test_51Qx4HqRtzrEMIcCeoHynfwxOuuMqaZcnnOvcTXiXbTYDUpyLlO4Dcs5PcaZ9b1PRAZ7fkOlhMAqVw98niOq3JK0c005qpUhFzy',
    path : API_PATH
}