const mongoose = require('mongoose');

const opinionSchema =  mongoose.Schema({
    name: String,
    opinion: String,
    email: String,
    registerDate: Date
});

const Opinion = mongoose.model('Opinion', opinionSchema);

module.exports = { Opinion }

master-1 에서 작업함 666
master-1 에서 작업함 777
master-1 에서 작업함 888