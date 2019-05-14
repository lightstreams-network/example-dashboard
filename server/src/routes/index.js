const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Lightstreams demo' });
});

router.use('/auth', require('./auth'));
router.use('/wallet', require('./wallet'));
router.use('/item', require('./item'));
router.use('/dashboard', require('./dashboard'));
router.use('/permission', require('./permission'));

module.exports = router;
