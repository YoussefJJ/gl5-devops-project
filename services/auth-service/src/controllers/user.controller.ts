import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from '../util/logger';
import { httpCounter, registerSuccessCounter, loginSuccessCounter, validateTokenSuccessCounter, validateTokenTotalCounter, loginTotalCounter, registerTotalCounter } from '../util/metrics';

const prisma = new PrismaClient()

//create child logger
const childLogger = logger.child({ service: 'auth-service'});

export const createUser = async (req: Request, res: Response) => {
    httpCounter.inc({ method: req.method, path: req.path, ip: req.ip });
    registerTotalCounter.inc();
    childLogger.info('Creating user', { request_id: req.headers['x-request-id'], request_ip: req.ip});

    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        childLogger.error('Email and password are required');
        return res.status(400).send({ error: 'Email and password are required' });
    }
    try {
        // encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        childLogger.info('Hashed password', { request_id: req.headers['x-request-id'], request_ip: req.ip});

        // find if exists
        const userExists = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (userExists) {
            childLogger.error('User already exists', { request_id: req.headers['x-request-id'], request_ip: req.ip});
            return res.status(400).send({ error: 'User already exists' });
        }
        childLogger.info('Creating user', { request_id: req.headers['x-request-id'], request_ip: req.ip});
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });
        // remove password from response
        delete user.password;
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        childLogger.info('User created', { request_id: req.headers['x-request-id'], request_ip: req.ip});

        res.status(201).send({
            data: user,
            token
        });
        registerSuccessCounter.inc();
    } catch (err) {
        childLogger.error('Error creating user', { request_id: req.headers['x-request-id'], request_ip: req.ip});
        res.status(400).send({ error: err.message });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    childLogger.info('Logging in user', { request_id: req.headers['x-request-id'], request_ip: req.ip});

    httpCounter.inc({ method: req.method, path: req.path });
    loginTotalCounter.inc({ ip: req.ip });
    
    const { email, password } = req.body;
    if (!email || !password) {
        childLogger.error('Email and password are required', { request_id: req.headers['x-request-id'], request_ip: req.ip});
        return res.status(400).send({ error: 'Email and password are required' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            childLogger.error('Invalid email or password', { request_id: req.headers['x-request-id'], request_ip: req.ip});
            return res.status(400).send({ error: 'Invalid email or password' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            childLogger.error('Invalid email or password', { request_id: req.headers['x-request-id'], request_ip: req.ip});
            return res.status(400).send({ error: 'Invalid email or password' });
        }
        // remove password from response
        delete user.password;
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).send({
            data: user,
            token
        });

        childLogger.info('User logged in', { request_id: req.headers['x-request-id'], request_ip: req.ip});
        
        loginSuccessCounter.inc({ ip: req.ip });
    } catch (err) {
        childLogger.error(err.message, { request_id: req.headers['x-request-id'], request_ip: req.ip});
        res.status(400).send({ error: err.message });
    }
}

export const validateToken = async (req: Request, res: Response) => {
    childLogger.info('Validating token', { request_id: req.headers['x-request-id'], request_ip: req.ip});
    
    httpCounter.inc({ method: req.method, path: req.path });
    validateTokenTotalCounter.inc();
    
    const token = req.headers.authorization;
    if (!token) {
        childLogger.error('Token is required', { request_id: req.headers['x-request-id'], request_ip: req.ip});
        return res.status(400).send({ error: 'Token is required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).send(decoded);
        
        childLogger.info('Token validated', { request_id: req.headers['x-request-id'], request_ip: req.ip});
        
        validateTokenSuccessCounter.inc();
    } catch (err) {
        childLogger.error(err.message, { request_id: req.headers['x-request-id'], request_ip: req.ip});
        res.status(400).send({ error: err.message });
    }
}