const mongoose = require('mongoose');

const opinionSchema =  mongoose.Schema({
    name: String,
    opinion: String,
    email: String,
    registerDate: Date
});

const Opinion = mongoose.model('Opinion', opinionSchema);

module.exports = { Opinion }

master-1 에서 작업함1111
master-1 에서 작업함2222
master-1 에서 작업함33333
