const Orden = require('../models/orden') //Agregar modelos creados en mongoose en base a su estructura.
const Producto =require('../models/producto')//Agregar schema de mongoose en base a su estructura.
const Usuario =require('../models/usuario')
const bcrypt = require('bcrypt')

const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'
const isAdmin = ({ currentAdmin }) => currentAdmin.role === 'admin'

module.exports={
    customResources:[
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
    ]
}