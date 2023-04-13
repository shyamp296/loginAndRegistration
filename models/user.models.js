const mongoose = require('mongoose');
const dateOnly = require('mongoose-dateonly')(mongoose);

const Schema = mongoose.Schema;
const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    }, 
    userPassword: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date
    }
})
module.exports = mongoose.model('User', userSchema);