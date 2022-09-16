const express = require('express');
const { PORT } = require('./config/index');
const databaseConfig = require('./config/database');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes');



const app = express();

start(); //start aplication and db

async function start() {
    await databaseConfig(app);
    expressConfig(app);
    routesConfig(app);
    
    // app.get('/', (req, res) => {
    //    res.send('It\'s Work!');
    // });

    app.listen(PORT, () => {
        
        console.log(`Application started at http://localhost:${PORT}`);
    });
}


//test
// async function test() {

//     const reqMock = {};
//     const resMock = {
//         cookie(){
//             console.log('Set cookie', arguments);
//         }
//     };

//     const nextMock = () => {};

//     try {
//         const auth = authMiddleware();

//         auth(reqMock,resMock,nextMock);

//         await reqMock.auth.login('test','1223');


//     } catch (error) {
//         console.log('Errors:', error.message);
//     }
// }