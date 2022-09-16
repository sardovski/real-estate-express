const authControler = require('../controllers/authControler');
const homeControler = require('../controllers/homeControler');
const rentControler = require('../controllers/rentControler');
const notFount = require('../controllers/notFountControler');

module.exports = (app) => {
    app.use('/',homeControler);
    app.use('/auth', authControler);
    app.use('/rents',rentControler);
    app.use('*',notFount);
};