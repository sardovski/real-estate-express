const { Schema, model } = require('mongoose');


const schema = new Schema({
    name: { type: String, required: [true,'Name is required' ],minLength: [6, 'Name must be at least 6 characters']},
    type: { type: String, required: [true,'Type is required'] },
    year: { type: Number, required: [true,'Available pieces is required'],min: [1850, 'Year betwen 1850 and 2021'],max: [2021, 'Year betwen 1850 and 2021'] },
    city: { type: String, required: [true,'City is required' ],minLength: [4, 'City  must be at least 4 characters']},
    image: { type: String, required: [true, 'Image is required'], match: [/^https?/, 'Image must be a valid URL'] },
    description: { type: String, required: [true, 'Description is required'], maxLength: [60, 'Description should be at max 60 characters long'] },
    space: { type: Number, required: [true,'Available pieces is required'],min: [0, 'Available pieces betwen 0 and 10'],max: [10, 'Available pieces betwen 0 and 10'] },
    guests: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt:{type:Date,default:Date.now}

});

// Name - string (required),
// Type - string (“Apartment”, “Villa”, “House”) required,
// Year - number (required),
// City – string (required),
// Home Image - string (required),
// Property Description - string (required),
// Available pieces - number(required)
// Rented a home - a collection of Users (reference to the User model)
// Owner - object Id (reference to the User model)


module.exports = model('Rent', schema);