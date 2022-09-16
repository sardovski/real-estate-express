const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userService = require('../services/userService');
const { COOKIE_NAME, TOKEN_SECRET } = require('../config/index');



module.exports = () => (req, res, next) => {

    //todo parse jwt
    //attach functions to context
    if (parseToken(req, res)) {
        req.auth = {
            async register(name,username, password) {
                const token = await register(name,username, password);
                res.cookie(COOKIE_NAME, token);
            },
            async login(username, password) {
                const token = await login(username, password);
                res.cookie(COOKIE_NAME, token);

            },
            logout() {
                res.clearCookie(COOKIE_NAME);
            }
        };


        next();
    }


};


async function register(name, username, pasword) {
    //todo adapt params to project specifics
    //todo validations

    const existing = await userService.getUserByUsername(username);

    if (existing) {
        throw new Error('Username already exist!');
    }

    const hashedPassword = await bcrypt.hash(pasword, 10);
    const user = await userService.createUser(name, username, hashedPassword);

    //login user automate after registration
    return generateToken(user);

}

async function login(username, password) {
    const user = await userService.getUserByUsername(username);

    if (!user) {
        const err = new Error('Invalid username');
        err.type = 'credential';
        throw err;
    }

    const passMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passMatch) {
        const err = new Error('Invalid password');
        err.type = 'credential';
        throw err;
    }

    return generateToken(user);

}


function generateToken(userData) {

    return jwt.sign({
        _id: userData._id,
        username: userData.username,
        name:userData.name
    }, TOKEN_SECRET);
}

function parseToken(req, res) {
    const token = req.cookies[COOKIE_NAME];

    if (token) {
        try {
            const userData = jwt.verify(token, TOKEN_SECRET);
            req.user = userData;
            res.locals.user = userData;

        } catch (err) {
            res.clearCookie(COOKIE_NAME);
            res.redirect('/auth/login');

            return false;

        }
    }
    return true;
}