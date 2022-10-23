const express = require('express');
const router = express.Router();
const AdsController = require('.../controllers/ads.controller');

router.get('/ads', AdsController.getAll);

router.get('/ads/:id', AdsController.getOne);

router.post('/ads/', AdsController.add);

router.delete('/ads/:id', AdsController.delete);

router.put('/ads/:id', AdsController.update);

router.get('ads/search/:searchPhrase', AdsController.search);

module.exports = router;