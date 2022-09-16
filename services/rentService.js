const Rent = require('../models/Rent');
const User = require('../models/User');

async function getAllRents(top) {
    let rents;
    if (top) {

        rents = await Rent.find({}).sort('-createdAt').limit(3).lean();

    } else {
        rents = await Rent.find({}).lean();

    }

    return rents;
}

async function getRentById(id) {
    return await Rent.findById(id).populate('guests').populate('owner').lean();
}

async function createRent(data) {
    const rent = new Rent(data);
    return await rent.save();

}

async function deleteRent(id) {
    await Rent.findByIdAndDelete(id);
}
async function editRent(id, rentData) {
    const rent = await Rent.findById(id);

    rent.name = rentData.name;
    rent.type = rentData.type;
    rent.year = rentData.year;
    rent.city = rentData.city;
    rent.image = rentData.image;
    rent.description = rentData.description;
    rent.space = rentData.space;

    await rent.save();
}
async function joinRent(id, userId) {
    const rent = await Rent.findById(id);
    rent.guests.push(userId);
    rent.space--;
    await rent.save();
    return rent;
}

module.exports = {
    getAllRents,
    getRentById,
    createRent,
    deleteRent,
    editRent,
    joinRent

};