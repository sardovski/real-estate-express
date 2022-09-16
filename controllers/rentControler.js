const router = require('express').Router();
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util/parsers');

router.get('/', async (req, res) => {

    try {
        const rents = await req.storage.getAllRents(false);

        res.render('rents/allRents', { rents });
    } catch (error) {
        console.log(error);
    }

});

router.get('/create', isUser(), async (req, res) => {
    res.render('rents/create');
});

router.post('/create', isUser(), async (req, res) => {
    try {
        ///TRIMMMMMMMMM
        const rentData = {
            name: req.body.name.trim(),
            type: req.body.type.trim(),
            year: Number(req.body.year),
            city: req.body.city.trim(),
            image: req.body.image.trim(),
            description: req.body.description.trim(),
            space: Number(req.body.space),
            owner: req.user._id

        };

        await req.storage.createRent(rentData);
        res.redirect('/rents');
    } catch (err) {
        console.log(err);
        const ctx = {
            errors: parseError(err), //parsvane
            rentData: {
                name: req.body.name,
                type: req.body.type,
                year: Number(req.body.year),
                city: req.body.city,
                image: req.body.image,
                description: req.body.description,
                space: parseInt(req.body.space)
            }
        };
        res.render('rents/create', ctx);
    }
});

router.get('/details/:id', async (req, res) => {
    try {
        const rent = await req.storage.getRentById(req.params.id);
        rent.printGuests = Object.values(rent.guests).map(b => ` ${b.name}`);
        if (rent.printGuests.length == 0) {
            rent.printGuests = false;
        }
        rent.isCreator = req.user && req.user._id == rent.owner._id;
        rent.hasJoined = req.user && rent.guests.find(u => u._id == req.user._id);
        if (rent.space > 0 && !rent.hasJoined) {
            rent.hasSpace = true;
        } else {
            rent.hasSpace = false;
        }
        rent.hasUser = Boolean(req.user);
        console.log(rent.printGuests);
        const ctx = {
            rent,
            user: req.user
        };

        res.render('rents/details', ctx);
    } catch (error) {
        console.log(error.message);
        res.redirect('/404');
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const rent = await req.storage.getRentById(req.params.id);

        if (rent.owner == req.user._id) {

            throw new Error('Cannot edit trip you have not created!');
        }

        res.render('rents/edit',  rent );
    } catch (err) {
        console.log(err.message);
        if (err) {
            res.redirect('/');

        } else {
            res.redirect('/trips/details/' + req.params.id);
        }
    }
});


router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        ///TRIMMMMMMMMM
        const rentData = {
            name: req.body.name.trim(),
            type: req.body.type.trim(),
            year: Number(req.body.year),
            city: req.body.city.trim(),
            image: req.body.image.trim(),
            description: req.body.description.trim(),
            space: Number(req.body.space)

        };

        await req.storage.editRent(req.params.id,rentData);
        res.redirect('/rents/details/' + req.params.id);
    } catch (err) {
        console.log(err);
        const ctx = {
            errors: parseError(err), //parsvane
            rentData: {
                name: req.body.name,
                type: req.body.type,
                year: Number(req.body.year),
                city: req.body.city,
                image: req.body.image,
                description: req.body.description,
                space: parseInt(req.body.space)
            }
        };
        res.render('rents/create', ctx);
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {

    try {
        await req.storage.deleteRent(req.params.id);
        res.redirect('/rents');
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/join/:id', isUser(), async (req, res) => {

    try {
        const rent = await req.storage.getRentById(req.params.id);

        if (rent.owner == req.user._id) {
            throw new Error('Cannot join your own trip!');
        }
        console.log(req.user._id);
        await req.storage.joinRent(req.params.id, req.user._id);
        res.redirect('/rents/details/' + req.params.id);
    } catch (err) {
        console.log(err.message);
        res.redirect('/rents/details/' + req.params.id);
    }
});


module.exports = router;