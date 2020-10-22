const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const Orden = require('./models/orden') //Agregar modelos creados en mongoose en base a su estructura.
const  Producto =require('./models/producto')//Agregar schema de mongoose en base a su estructura.

AdminBro.registerAdapter(AdminBroMongoose)

const run = async () => {
    try {
        //reemplazar "mongodb://localhost/mongoTest" con la dirección a tu base en MongoAtlas o MongoCompass segun corresponda.
        const connection = await mongoose.connect('mongodb://localhost/mongoTest', {
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
        const adminBro = new AdminBro ({
            Database: [connection],
            resources:[
                Orden,
                Producto
            ],
            rootPath:'/dash'
        });
        const router = AdminBroExpress.buildRouter(adminBro);
        app.use(adminBro.options.rootPath, router)
        app.listen(8080, () => console.log('AdminBro is under localhost:8080/dash'))
    } catch (error) {
        console.log(error);
    }
}
run();


