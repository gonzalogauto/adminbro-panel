const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdenSchema = new Schema({
    mesaId:  String,
    author: String,
    cantidad: Number,
    date: { type: Date, default: Date.now },
});

module.exports=mongoose.model('orden',OrdenSchema);