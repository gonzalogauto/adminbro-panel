module.exports = {
    customTranslation:{
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
}