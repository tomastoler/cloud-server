const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/profile', isAuthenticated, (req, res, next) => {
    res.render('profile');
    // console.log(req.session);
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/upload', isAuthenticated, (req, res, next) => {
    res.render('uploader');
});

router.post('/upload', isAuthenticated, (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.send('send a file');
    }
    // console.log(req.files.file);
    let file = req.files.file;
    let uploadpath = `${req.user.path}/${file.name}`;
    console.log(uploadpath);
    req.files.file.mv(uploadpath, (err) => {
        res.send(err);
    });
    res.redirect('/profile');
});


router.get('/my_files', isAuthenticated, (req, res, next) => {
    fs.readdir(req.user.path, (err, list) => {
        if(err){
            console.log(err);
            res.send(err);
        } else {
            console.log(list);
            res.render('my-files', {files: list});
        }
    });
});

router.get('/my_files/:filename', isAuthenticated, (req, res, next) => {
    // console.log(`${req.user.path}/${req.params.filename}`);
    res.sendFile(path.join(req.user.path, req.params.filename));
    // res.redirect('/profile');
});

// middleware
function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/')
}

module.exports = router;