const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my_own_cloud', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then((db) => console.log('db is connected'))
    .catch((err) => console.log(err));