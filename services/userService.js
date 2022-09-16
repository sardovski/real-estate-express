const User = require('../models/User');

async function createUser(name,username, hashedPassword) {
    //todo adapt to curent project
    const user = new User({
        name,
        username,
        hashedPassword
    });

    await user.save();

    return user;
}

async function getUserByUsername(username) {

    const userRegex = new RegExp(`^${username}$`, 'i');
    const user = await User.findOne({ username: { $regex: userRegex } });
    return user;

}

module.exports = {
    createUser,
    getUserByUsername
};

