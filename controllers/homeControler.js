const router = require('express').Router();

router.get('/',async (req,res)=>{

    try {
        const rents = await req.storage.getAllRents(true);
        
        res.render('home',{rents});
    } catch (error) {
        console.log(error);
    }

});


module.exports = router;