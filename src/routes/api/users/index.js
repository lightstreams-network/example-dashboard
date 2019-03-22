const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
    find,
    fetchAll,
    create,
    update,
    remove
} = require('src/lib/crud-controller');


const defaultFields = [
    'id',
    'email',
    'password'
];

router.get('/users/:id', passport.authenticate('jwt', { session: false }), find('user'));

router.get('/users', fetchAll('user'));

router.post('/users', create('user'));

router.patch('/users/:id', update('user'));

router.delete('/users/:id', remove('user'));

module.exports = router;
