import promClient from 'prom-client';

export const register = new promClient.Registry();
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ register });

export const httpCounter = new promClient.Counter({
    name: 'auth_service_counter',
    help: 'auth_service_counter',
    labelNames: ['method', 'path'],
    registers: [register]
});

export const registerSuccessCounter = new promClient.Counter({
    name: 'auth_service_register_success_counter',
    help: 'auth_service_register_success_counter',
    registers: [register]
});

export const registerTotalCounter = new promClient.Counter({
    name: 'auth_service_register_total_counter',
    help: 'auth_service_register_total_counter',
    registers: [register]
});

export const loginSuccessCounter = new promClient.Counter({
    name: 'auth_service_login_success_counter',
    help: 'auth_service_login_success_counter',
    registers: [register]
});

export const loginTotalCounter = new promClient.Counter({
    name: 'auth_service_login_total_counter',
    help: 'auth_service_login_total_counter',
    registers: [register]
});

export const validateTokenTotalCounter = new promClient.Counter({
    name: 'auth_service_token_total_counter',
    help: 'auth_service_token_total_counter',
    registers: [register]
});

export const validateTokenSuccessCounter = new promClient.Counter({
    name: 'auth_service_token__counter',
    help: 'auth_service_token_success_counter',
    registers: [register]
});