const storage = require('../services/rentService');



module.exports = () => (req, res, next) => {
    //todo import and decorare services


    req.storage = {
        ...storage
    };

    next();
};