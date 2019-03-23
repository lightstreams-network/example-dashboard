const { notFoundResponse, jsonResponse } = require('../lib/responses');

module.exports.notFoundHandler = (req, res, next) => {
    next(notFoundResponse());
};

module.exports.errorHandler = (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;

    res.locals.error = req.app.get('env') === 'development' ? err : {};

    const status = err.status || 500;

    res.status(status);

    if (/json/.test(req.get('accept'))) {
        res.json(jsonResponse({}, err))
    } else {
        res.render('error');
    }

};
