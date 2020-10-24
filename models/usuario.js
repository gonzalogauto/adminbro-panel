const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    email: { type: String, required: true },
    title: { type: String, required: true },
    avatarUrl: { type: String},
    encryptedPassword: { type: String, required: true },
    role: { type: String, enum: ['admin', 'restricted'], required: true },
});

module.exports=mongoose.model('usuario',UsuarioSchema);