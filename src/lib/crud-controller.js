const debug = require('debug')('fanbase:server')
const _ = require('lodash');
const { DateTime } = require('luxon');

const {
    notFoundResponse,
    badInputResponse
} = require('./responses');

function find(modelName) {
    return (req, res, next) => {
        const model = require('../models')[modelName];
        const id = parseInt(req.params.id, 10);

        if (_.isNaN(id)) {
            next(badInputResponse());
            return;
        }

        model.findById(id)
        .then(row => {
            if (_.isNil(row)) {
                next(notFoundResponse());
                return;
            }
            return res.json(row);
        })
        .catch(e => {
            debug(e);
            next(e);
        });
    }
}

function fetchAll(modelName) {
    return (req, res, next) => {
        const model = require('../models')[modelName];
        const limit = parseInt(req.query.limit, 10) || 1000;
        const offset = parseInt(req.query.offset, 10) || 0;

        if (_.isNaN(offset)) {
            next(badInputResponse());
            return;
        }

        model.findAll({
            limit,
            offset,
            order: [
                ['created_at', 'DESC'],
            ]
        })
        .then(rows => {
            if (_.isNil(rows)) {
                next(notFoundResponse());
                return;
            }
            return res.json(rows);
        })
        .catch(e => {
            debug(e);
            next(e);
            return;
        });
    }
}

function create(modelName, fields) {
    return (req, res, next) => {
        const model = require('../models')[modelName];
        const body = req.body;

        if (!req.body) {
            return next(badInputResponse());
        }

        const attrs = _.reduce(Object.keys(body), (result, key) => {
            if (fields.indexOf(key) !== -1) {
                result[key] = body[key];
            }
            return result;
        }, {});

        if (!_.isNil(attrs.id)) delete attrs.id;

        const now = DateTime.utc().toSQL();

        model.create({
            ...attrs,
            created_at: now,
            modified_at: now,
        })
        .then(row => {
            res.json(row.get({ plain: true }));
        })
        .catch(err => {
            debug(err);
            next(err);
        });
    }
}

function update(modelName, fields) {
    return (req, res, next) => {
        const model = require('../models')[modelName];
        const id = parseInt(req.params.id, 10);
        const body = req.body;

        if (_.isNaN(id)) {
            next(badInputResponse());
            return;
        }

        if (!req.body) {
            return next(badInputResponse());
        }

        const attrs = _.reduce(Object.keys(body), (result, key) => {
            if (fields.indexOf(key) !== -1) {
                result[key] = body[key];
            }
            return result;
        }, {});

        model.update({
            ...attrs,
            modified_at: DateTime.utc().toSQL()
        }, {
            returning: true,
            where: {
                id
            }
        })
        .spread((count, row) => {
            res.json({ count, row });
        })
        .catch(err => {
            debug(err);
            next(err);
        });
    }
}

function remove(modelName) {
    return (req, res, next) => {
        const model = require('../models')[modelName];
        const id = parseInt(req.params.id, 10);

        if (_.isNaN(id)) {
            next(badInputResponse());
            return;
        }

        model.destroy({ returning: true, where: { id }})
        .then((count) => {
            res.json(count);
        })
        .catch(err => {
            debug(err);
            next(err);
        });
    }
}

module.exports = {
    find,
    fetchAll,
    create,
    update,
    remove,
};
