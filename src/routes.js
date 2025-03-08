import express from 'express';
import apiController from './controllers/apiController.js';

const router = express.Router();

router.get('/bot/eligibility', apiController.checkBotEligibility);

export default router;