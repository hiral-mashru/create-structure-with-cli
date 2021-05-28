const { program } = require('commander');
const pkgConfig = require('./package.json') 
const { init } = require('./core/init')
const { green, red } = require('chalk');
const dbConfig = require('./helpers/dbConfig');
const create_module = require('./core/create_module')
const create_api = require('./core/create_api')
const create_middleware = require('./core/create_middleware')
const create_globalMiddleware = require('./core/create_globalMiddleware')
const create_function = require('./core/create_function')
const create_service = require('./core/create_service')

program.version(pkgConfig.version).description(pkgConfig.description)

// framework init
program.command('init').description('To initialize the basic setup.').action(()=>{
    init()
          .then((result)=>{
              if(result){
                  console.log(green('Setup is ready.'))
              }
          })
          .catch((err)=>{
              console.log(red('ERROR: ')+err)
          });
})

// framework db-config
program.command('db-config').description('To configure the database.').action(()=>{
    dbConfig()
})

program.command('create-module <module...>').description('Name of module').action((modulle)=>{
      create_module(modulle)
  })

program.command('create-api').description('To create api.').action(()=>{
    create_api()
})

program.command('create-middleware').description('To create module level middleware.').action(()=>{
    create_middleware()
})

program.command('create-globalMiddleware').description('To create global middleware.').action(()=>{
    create_globalMiddleware()
})

program.command('create-function').description('To create function.').action(()=>{
    create_function()
})

program.command('create-service').description('To create service.').action(()=>{
    create_service()
})

program.parse(process.argv);
