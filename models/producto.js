const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema= new Schema({
    nombre:String,
    descripcion:String,
    precio:Number,
    tipoCombo:Boolean
});

module.exports=mongoose.model('producto',ProductoSchema);