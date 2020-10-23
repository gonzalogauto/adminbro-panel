const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const Orden = require('./models/orden') //Agregar modelos creados en mongoose en base a su estructura.
const Producto =require('./models/producto')//Agregar schema de mongoose en base a su estructura.
const Usuario =require('./models/usuario')
const bcrypt = require('bcrypt')

AdminBro.registerAdapter(AdminBroMongoose)

const run = async () => {
    try {
        //reemplazar "mongodb://localhost/mongoTest" con la dirección a tu base en MongoAtlas o MongoCompass segun corresponda.
        const connection = await mongoose.connect('mongodb://localhost/mongoTest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false
        });
        const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
        const isAdmin = ({ currentAdmin }) => currentAdmin.role === 'admin'
        const adminBro = new AdminBro ({
            Database: [connection],
            resources:[
                { 
                  resource: Orden, 
                  options: {
                    parent:{
                        name:'Inicio'
                    },
                    listProperties: ['mesaId', 'author','cantidad','date'],
                    properties:{
                        mesaId:{
                            label:'Mesa',availableValues: [
                                {value: '1', label: 'Mesa1'},
                                {value: '2', label: 'Mesa2'},
                                {value: '3', label: 'Mesa3'},
                                {value: '4', label: 'Mesa4'},
                                {value: '5', label: 'Mesa5'},
                            ],
                        }
                    },
                  },
                },
                { 
                  resource: Producto, 
                  options: {
                      parent:{
                        name:'Inicio'
                      },
                      listProperties: ['nombre', 'descripcion','tipoCombo','precio'],
                      properties:{
                          tipoCombo:{
                            availableValues:[
                                {value:false,label:"No"},
                                {value:true,label:"Si"}
                            ]
                          }
                      },
                      actions:{
                        edit: { isAccessible: canModifyUsers },
                        delete: { isAccessible: canModifyUsers },
                        new: { isAccessible: canModifyUsers },
                      }
                    } 
                },
                {
                    resource: Usuario,
                    options: {
                      parent:{
                        name:'Seguridad'
                      },
                      properties: {
                        encryptedPassword: { isVisible: false },
                        password: {
                          type: 'string',
                          isVisible: {
                            list: false, edit: true, filter: false, show: false,
                          },
                        },
                      },
                      actions: {
                        new: {
                          isAccessible:  isAdmin,
                          before: async (request) => {
                            if(request.payload.password) {
                              request.payload = {
                                ...request.payload,
                                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                                password: undefined,
                              }
                            }
                            return request
                          },
                        },
                        edit: { isAccessible: canModifyUsers },
                        delete: { isAccessible: canModifyUsers },
                      }
                    }
                }
            ],
            locale: {
                translations: {
                    labels: {
                        orden: 'Reservas',
                        producto:'Productos',
                        usuario:'Usuarios',
                        email:'Correo'
                    },
                    buttons: {
                        save: 'Guardar',
                        logout:'Cerrar sesión',
                        login:'Ingresar'
                    },
                    resources: {
                        orden: {
                          actions: {
                            new: 'Nueva reserva',
                            list:'Total reservas:',
                            delete:'Borrar',
                            bulkDelete:'Borrar todo',
                            show:'Ver',
                            edit:'Editar'
                          }
                        },
                        usuario: {
                            actions: {
                              new: 'Nuevo usuario',
                              list:'Total usuarios:',
                              delete:'Borrar',
                              bulkDelete:'Borrar todo',
                              show:'Ver',
                              edit:'Editar'
                            }
                        },
                        producto:{
                            actions: {
                                new: 'Nuevo producto',
                                list:'Total productos:',
                                delete:'Borrar',
                                bulkDelete:'Borrar todo',
                                show:'Ver',
                                edit:'Editar'
                            }
                        }
                    }
                }
              },
            branding: {
                companyName: 'GDEV Company',
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


