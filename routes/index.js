import express from 'express';
const router = express.Router();


import pageController from '../controller/pageController.js';


router.get('/', pageController.getHomePage);

export default router;
