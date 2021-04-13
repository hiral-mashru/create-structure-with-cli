const { program } = require('commander');
const pkgConfig = require('./package.json') 
const { init } = require('./helpers/init')
const { green, red } = require('chalk');
const dbConfig = require('./core/dbConfig');
const create_module = require('./helpers/create_module')

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

program.command('create-module <modulle>').description('Name of module')
  .action((modulle)=>{
      console.log(modulle)
      create_module(modulle)
  })

program.parse(process.argv);
