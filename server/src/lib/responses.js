
module.exports.notFoundResponse = function notFound() {
    const err = new Error('Not found');
    err.status = 404;
    return err;
};

module.exports.badInputResponse = function badInput(msg) {
    const err = new Error(msg || 'Bad input parameter');
    err.status = 400;
    return err;
};

module.exports.unauthorizedResponse = function unauthorized(msg) {
    const err = new Error(msg || 'Unauthorized');
    err.status = 401;
    return err;
};


module.exports.jsonResponse = (data, err) => {
    if (err) {
        return { success: false, message: err.message, data }
    }
    return { success: true, data }
};