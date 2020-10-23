const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const Usuario = require('./models/usuario')
const { customResources } = require('./src/resources');
const { customTranslation } = require('./src/translations')

AdminBro.registerAdapter(AdminBroMongoose)

const run = async () => {
    try {
        //reemplazar "mongodb://localhost/mongoTest" con la dirección a tu base en MongoAtlas o MongoCompass segun corresponda.
        const connection = await mongoose.connect('mongodb://localhost/mongoTest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false
        });
        const adminBro = new AdminBro ({
            Database: [connection],
            resources: customResources,
            locale: {
                translations: customTranslation
              },
            branding: {
                companyName: 'GDEV Company',
                softwareBrothers: false
            },
            rootPath:'/admin'
        });
        const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
            authenticate: async (email, password) => {
                const user = await Usuario.findOne({ email })
                if (user) {
                  const matched = await bcrypt.compare(password, user.encryptedPassword)
                  if (matched) {
                    return user
                  }
                }
                return false              
            },
            cookiePassword: 'some-secret-password-used-to-secure-cookie',});
        app.use(adminBro.options.rootPath, router)
        app.listen(8080, () => console.log('AdminBro is under localhost:8080/dash'))
    } catch (error) {
        console.log(error);
    }
}
run();


