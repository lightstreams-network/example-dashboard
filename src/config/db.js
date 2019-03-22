
module.exports = {
    username: process.env.DB_USER || null,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'fanbase',
    dialect: process.env.DB_DRIVER || 'sqlite',
    storage: process.env.DB_FILE_PATH || '/tmp/fanbase.sqlite'
};
