'use strict';

const express = require('express');
const path = require('path');
const app = express();
// const router = express.Router();

app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(express.static(path.resolve(__dirname, '..', 'node_modules')));
app.use(express.static(path.resolve(__dirname, '..', 'static')));

// router.get('/profile+', function(req) {
//     if (isAuth.data.body.is_authorized === true) {
//         console.log(window.location)
//         navbar({"User": {"id": "1"}});
//         router.redirect('/profile1');
//     } else {
//         navbar();
//         router.redirect('/login');
//     }
// })

const port = process.env.PORT || 8000;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});
