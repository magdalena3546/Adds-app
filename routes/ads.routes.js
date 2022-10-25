const express = require('express');
const router = express.Router();
const AdsController = require('../controllers/ads.controller');
const authMiddleware = require('../utils/authMiddleware')

router.get('/ads', AdsController.getAll);

router.get('/ads/:id', AdsController.getOne);

router.post('/ads', authMiddleware, AdsController.add);

router.delete('/ads/:id', authMiddleware, AdsController.delete);

router.put('/ads/:id', authMiddleware, AdsController.update);

router.get('/ads/search/:searchPhrase', AdsController.search);

module.exports = router;