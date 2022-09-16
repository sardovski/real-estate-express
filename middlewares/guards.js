function isUser() {
    return (req, res, next) => {
       console.log('Checking for user');

        if (req.user) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}

function isGuest() {
   return (req, res, next) => {
       console.log('Checking for guest');
        if (!req.user) {
            next();
        } else {
            res.redirect('/');
        }
    };
}

module.exports = {
    isUser,
    isGuest
};