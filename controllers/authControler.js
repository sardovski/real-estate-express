const router = require('express').Router();
const { body, validationResult } = require('express-validator');

const { isGuest, isUser } = require('../middlewares/guards');

router.get('/register', isGuest(), (req, res) => {
    res.render('user/register');
});
//todo changes by project requirements
router.post('/register', isGuest(),
body('name').trim().custom((value, { req }) => {
    const pattern = /^[A-Z]{1}[a-z]+\s[A-Z]{1}[a-z]+$/;
    if (!pattern.test(value)) {
        throw new Error('The name should be in the following format -> (firstname lastname) - "Alexandur Petrov" ');
    }

    return true;
}),
    body('username')
        .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long').trim(),
    body('password')
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long').trim(),
    body('rePass').custom((value, { req }) => {

        if (value.trim() != req.body.password) {
            throw new Error('Passwords don\'t match');
        }

        return true;
    }),
    async (req, res) => {
        const { errors } = validationResult(req);

        try {
            if (errors.length > 0) {
                //todo improve err msg
                console.log(errors);
                throw new Error(Object.values(errors).map(e=>e.msg).join('\n'));
            }

            await req.auth.register(req.body.name, req.body.username, req.body.password);
            
            res.redirect('/'); //todo change location for specific of the project

        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    name:req.body.name,
                    username: req.body.username
                }
            };

            res.render('user/register',ctx);
        }
    });

router.get('/login', isGuest(), (req, res) => {
    res.render('user/login');
});

router.post('/login', isGuest(), async (req, res) => {
   
    try {
        await req.auth.login(req.body.username, req.body.password);

        res.redirect('/');

    } catch (err) {
        console.log(err.message);
        let errors = [err.message];
        if(err.type == 'credential'){
            errors = ['Incorect username or password'];
        }
        const ctx = {
            errors,
            userData: {
                username: req.body.username
            }
        };

        res.render('user/login',ctx);

    }
});

router.get('/logout', (req, res) => {
    console.log('user logout');
    req.auth.logout();
    res.redirect('/');

});

module.exports = router;