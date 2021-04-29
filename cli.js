#!/usr/bin/env node
var Spinner = require('cli-spinner').Spinner;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const Confirm = require('prompt-confirm')
const rootDir = process.cwd()
const download = require('download-git-repo')
const inquirer = require('inquirer');
const { program } = require('commander');
const pkgConfig = require('./package.json')
const gitRepoLink = 'hiral-mashru/boilerplate-structure'

let devusername="root";
let devpassword="";
let devdatabase="database_development";
let prousername="root";
let propassword="";
let prodatabase="database_production";
let databaseJsonData=`{
  "development": {
    "username": "${devusername}",
    "password": "${devpassword}",
    "database": "${devdatabase}",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "username": "${prousername}",
    "password": "${propassword}",
    "database": "${prodatabase}",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
}`

program.version(pkgConfig.version).description(pkgConfig.description)

program.command('create-folder <module>').description('To create folder.').action((modulle)=>{  
    if(modulle){
        if (!fs.existsSync(String(modulle))) {
            fs.mkdir(path.join(rootDir, String(modulle)),{ recursive: true }, (err) => { 
                if (err) { 
                    console.log(chalk.red('ERROR:')+` Directory ${modulle} can't be created`) 
                } 
                console.log(chalk.green(`Directory ${modulle} created successfully!`)); 
            });
        } else {
            console.log(chalk.black.bgYellowBright('WARNING:')+`${modulle} already exists`)
        }
    } else {
        console.log(chalk.black.bgYellowBright('WARNING:')+'Provide a module name')
    }

})

program.command('init').description('To initialize the basic setup.').action(()=>{
    fs.readdir(rootDir, function(err, files){
        if(files.length){
            new Confirm({message: 'You have already done initialization. Do you want to do init?', default: false})
            .run()
            .then(function(answer){
                if(answer){
                    var spinner = new Spinner('processing.. %s');
                    spinner.setSpinnerString('|/-\\');
                    spinner.start();
                    download(gitRepoLink, rootDir, function (err) {
                        flag = true
                        console.log(err ? chalk.red('Error in downloading folder structure') : chalk.green('Success'))
                        spinner.stop(true)
                        if(!err){
                            createStructure()
                        }
                    })
                }
            })
        } else {
            var spinner = new Spinner('processing.. %s');
            spinner.setSpinnerString('|/-\\');
            spinner.start();
            download(gitRepoLink, rootDir, function (err) {
                flag = true
                console.log(err ? chalk.red('Error in downloading folder structure') : chalk.green('Success'))
                spinner.stop(true)
                if(!err){
                    createStructure()
                }
            })
        }
    })
})

program.command('create-module <module...>').description('To create module in api folder').action((modulle)=>{
    if(modulle.length === 0){
        console.log(chalk.black.bgYellowBright('WARNING:')+' Provide module name...')
        return
    }
    for(let m of modulle){
        if(m) {
            createModule(m)
        } else {
            console.log(chalk.black.bgYellowBright('WARNING:')+' Provide module\'s name')
        }
    }
})

program.command('db-config').description('To configure the database.').action(()=>{
    fs.readdir(path.join(rootDir),function(err,files){
        if (!files.includes('config')) {
            fs.mkdir(path.join(rootDir,'config'),{ recursive: true }, (err) => { 
                if (err) { 
                    console.log(chalk.red('ERROR:')+` Directory config can't be created`) 
                }  
            });
        }
    }) 
    dbConfig()
})

program.command('create-api').description('To create api.').action(()=>{
    let flss = fs.readdirSync(path.join(rootDir))
    if(!flss.includes('api')){
        fs.mkdirSync(path.join(rootDir,'api'),{ recursive: true });
    }
    let files = fs.readdirSync(path.join(rootDir,'api')) 
    if(!files || files.length === 0){
        console.log(chalk.black.bgYellowBright('WARNING:')+' There are no folders at '+rootDir+'/api')
    }
    files.push("Want_New_module?")
    var ques = [{
        type: 'list',
        name: 'modules',
        message: "Enter Module Name:",
        choices: files.map(a => { return {name: a,value: a}})
    }]
    inquirer.prompt(ques).then(answers => {
        if(answers['modules'] === 'Want_New_module?'){
            let q = [{
                type: 'input',
                name: 'mdl',
                message: "Enter new module: ",
                validate: function( value ) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Enter new module: ';
                    }
                }
            }]
            inquirer.prompt(q).then(ans=>{
                createModule(ans['mdl'])
                createApi(ans['mdl'])
            })
        } else {
            createApi(answers['modules'])
        }
    })
})

program.command('create-middleware').description('To create module level middleware.').action(()=>{
    fs.readdir(path.join(rootDir),function(err,files){
        if(!files.includes('api')){
            fs.mkdirSync(path.join(rootDir,'api'),{ recursive: true });
        }
    })
    fs.readdir(path.join(rootDir,'api'),function(err,files){
        if (err) {
            fs.mkdir(path.join(rootDir,'api'),{ recursive: true }, (err) => { 
                if (err) { 
                    console.log(chalk.red('ERROR:')+` Directory api can't be created`) 
                }  
            });
        } 
        if(files && files.length!==0){
            var ques = [
                {
                    type: 'list',
                    name: 'modules',
                    message: "Enter Module Name:",
                    choices: files.map(a => { return {name: a,value: a}})
                }
            ]
            inquirer.prompt(ques).then(answers => {
                createMiddleware(answers['modules'])
            })
        } else {
            console.log(chalk.red('ERROR:')+' There are no folders at '+rootDir+'/api, create module using "framework create-module"')
        }
    })
})

program.command('create-globalMiddleware').description('To create global middleware.').action(()=>{
    fs.readdir(path.join(rootDir),function(err,files){
        if(!files.includes('api')){
            fs.mkdirSync(path.join(rootDir,'api'),{ recursive: true });
        }
    })
    fs.readdir(path.join(rootDir,'api'),function(err,files){
        if (err) {
            fs.mkdir(path.join(rootDir,'api'),{ recursive: true }, (err) => { 
                if (err) { 
                    console.log(chalk.red('ERROR:')+` Directory api can't be created`) 
                }  
            });
        } 
        if(files && files.length!==0){
            var ques = [
                {
                    type: 'list',
                    name: 'modules',
                    message: "Enter Module Name:",
                    choices: files.map(a => { return {name: a,value: a}})
                }
            ]
            inquirer.prompt(ques).then(answers => {
                createGlobalMiddleware(answers['modules'])
            })
        } else {
            console.log(chalk.red('ERROR:')+' There are no folders at '+rootDir+'/api, create module using "framework create-module"')
        }
    })
})

program.command('create-function').description('To create function.').action(()=>{
    inquirer.prompt({
        type: 'list',
        name: 'function',
        message: "Enter type of function:",
        choices: [{value: "moduleLevel",name: "Module level functions"},{value: "globalLevel",name: "Global level functions"}] 
    }).then(ansr => {
        if(ansr['function']==='moduleLevel'){
            let flss = fs.readdirSync(path.join(rootDir))
            if(!flss.includes('api')){
                fs.mkdirSync(path.join(rootDir,'api'),{ recursive: true });
            }
            let files = fs.readdirSync(path.join(rootDir,'api')) 
            if(!files || files.length === 0){
                console.log(chalk.black.bgYellowBright('WARNING:')+' There are no folders at '+rootDir+'/api')
            }
            files.push("Want_New_module?")
            var ques = [
                {
                    type: 'list',
                    name: 'modules',
                    message: "Enter Module Name:",
                    choices: files.map(a => { return {name: a,value: a}})
                }
            ]
            inquirer.prompt(ques).then(answers => {
                if(answers['modules'] === 'Want_New_module?'){
                    let q = [{
                        type: 'input',
                        name: 'mdl',
                        message: "Enter new module: ",
                        validate: function( value ) {
                            if (value.length) {
                                return true;
                            } else {
                                return 'Enter new module: ';
                            }
                        }
                    }]
                    inquirer.prompt(q).then(ans=>{
                        createModule(ans['mdl'])
                        createFunction(ans['mdl'])
                    })
                } else {
                    createFunction(answers['modules'])
                }
            })
        } else {
            createGlobalFunction()
        }
    })
})

program.command('create-service').description('To create service.').action(()=>{
    inquirer.prompt({
        type: 'list',
        name: 'service',
        message: "Enter type of service:",
        choices: [{value: "moduleLevel",name: "Module level services"},{value: "globalLevel",name: "Global level services"}] 
    }).then(ansr => {
        if(ansr['service']==='moduleLevel'){
            let flss = fs.readdirSync(path.join(rootDir))
            if(!flss.includes('api')){
                fs.mkdirSync(path.join(rootDir,'api'),{ recursive: true });
            }
            let files = fs.readdirSync(path.join(rootDir,'api')) 
            if(!files || files.length === 0){
                console.log(chalk.black.bgYellowBright('WARNING:')+' There are no folders at '+rootDir+'/api')
            }
            files.push("Want_New_module?")
            var ques = [
                {
                    type: 'list',
                    name: 'modules',
                    message: "Enter Module Name:",
                    choices: files.map(a => { return {name: a,value: a}})
                }
            ]
            inquirer.prompt(ques).then(answers => {
                if(answers['modules'] === 'Want_New_module?'){
                    let q = [{
                        type: 'input',
                        name: 'mdl',
                        message: "Enter new module: ",
                        validate: function( value ) {
                            if (value.length) {
                                return true;
                            } else {
                                return 'Enter new module: ';
                            }
                        }
                    }]
                    inquirer.prompt(q).then(ans=>{
                        createModule(ans['mdl'])
                        createService(ans['mdl'])
                    })
                } else {
                    createService(answers['modules'])
                }
            })
        } else {
            createGlobalService()
        }
    })
})

program.parse(process.argv);

function createStructure(){
    fs.mkdir(path.join(rootDir, 'api'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory api can't be created`) 
        }  
    });
    fs.mkdir(path.join(rootDir, 'config'), { recursive: true },(err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory config can't be created`) 
        }  
    });
    fs.mkdir(path.join(rootDir, 'core'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory core can't be created`) 
        } 
    });
    fs.mkdir(path.join(rootDir, 'crons'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory crons can't be created`)  
        } 
    });
    fs.mkdir(path.join(rootDir, 'db'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory db can't be created`)  
        } 
    });
    fs.mkdir(path.join(rootDir, 'dbLogs'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory dbLogs can't be created`)  
        } 
    });
    fs.mkdir(path.join(rootDir, 'db','models'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory db/models can't be created`)  
        } 
    });
    fs.mkdir(path.join(rootDir, 'db','migrations'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory db/migrations can't be created`) 
        } 
    });
    fs.mkdir(path.join(rootDir, 'db','seeders'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory db/seeders can't be created`)  
        } 
    });
    fs.mkdir(path.join(rootDir, 'functions'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory functions can't be created`)  
        } 
    });
    fs.mkdir(path.join(rootDir, 'middlewares'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory middlewares can't be created`) 
        } 
    });
    fs.mkdir(path.join(rootDir, 'services'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory services can't be created`) 
        } 
    });
    if(!fs.existsSync(rootDir+'/middlewares/middleware.js')) {
        fs.writeFile(path.join(rootDir,'middlewares','middleware.js'),`module.exports = {\n middleware: (req,res,next)=> {\n  console.log("This is global middleware")\n  res.send('This is global middleware')\n  next();\n }\n}`, function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File /middlewares/middleware.js can't be created`) 
        })
    }
        
    fs.appendFile(path.join(rootDir,'.gitignore'),`node_modules/`, function(err, result) {
        if(err) console.log(chalk.red('ERROR:')+` File .gitignore can't be created`) 
    })
    
    fs.mkdir(path.join(rootDir, 'src'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory src can't be created`)  
        } 
    });
    fs.mkdir(path.join(rootDir, 'uploads'),{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory uploads can't be created`)  
        } 
    });
    
        fs.appendFile(path.join(rootDir, '.env'),'', function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File .env can't be created`) 
        })
    
    
        fs.appendFile(path.join(rootDir, 'core', 'connection.js'),'', function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File core/connection.js can't be created`) 
        })
    
     
        fs.appendFile(path.join(rootDir, 'core', 'migrations.js'),'', function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File core/migrations.js can't be created`) 
        })
    

        fs.appendFile(path.join(rootDir, 'core', 'routes.js'),'', function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File core/routes.js can't be created`) 
        })

    
        fs.appendFile(path.join(rootDir, 'core', 'models.js'),'', function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File core/models.js can't be created`) 
        })
    
    
        fs.appendFile(path.join(rootDir, 'core', 'services.js'),'', function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File core/services.js can't be created`) 
        })
    
        fs.appendFile(path.join(rootDir, 'src', 'app.js'),'', function(err, result) {
            if(err) {console.log(chalk.red('ERROR:')+` File src/app.js can't be created`);}
        })

        fs.writeFile(path.join(rootDir,'config','database.json'),(databaseJsonData),function(err,result){
            if(err) {console.log(chalk.red('ERROR:')+` File config/database.json can't be created`);}
        })
    
    new Confirm({message: 'Do you want to config db right now?', default: false})
    .run()
    .then(function(answer){
        if(answer){
            dbConfig()
        }
    })
}

function dbConfig(){
    if(!fs.existsSync(rootDir+'/config'+'/database.json')) {
        fs.mkdirSync(rootDir+'/config', {recursive: true})
        fs.writeFileSync(rootDir+'/config/database.json',databaseJsonData)
    }
    new Confirm({message:'Do you want to setup development env?'})
        .run()
        .then(function(answer){
            if(answer){
                createJSON('dev')
            } else {
                new Confirm({message:'Do you want to setup production env?'})
                .run()
                .then(function(ans){
                    if(ans){
                        createJSON('prod')
                    }
                })
            }
        })
}

function createJSON(setting){
    var questions = [
        {
          type: 'input',
          name: 'username',
          message: "Enter username: ",
          validate: function( value ) {
            if (value.length) {
              return true;
            } else {
              return 'Enter the username: ';
            }
          }
        },
        {
            type: 'password',
            name: 'password',
            message: "Enter password: "
        },
        {
            type: 'input',
            name: 'database',
            message: "Enter database name: ",
            validate: function( value ) {
                if (value.length) {
                  return true;
                } else {
                  return 'Enter database name:';
                }
            }
        },
        {
            type: 'input',
            name: 'host',
            message: "Enter host: "
        },
        {
            type: 'input',
            name: 'dialect',
            message: "Enter dialect: "
        },
        {
            type: 'confirm',
            name: 'logging',
            message: "Enter logging: ",
            default: false
        }
    ]
    inquirer.prompt(questions).then(answers => {
        if(setting === 'dev'){
            databaseJsonData=`{
    "development": {
        "username": "${answers['username']}",
        "password": "${answers['password']}",
        "database": "${answers['database']}",
        "host": "${answers['host'] || '127.0.0.1'}",
        "dialect": "${answers['dialect'] || 'mysql'}",
        "logging": ${answers['logging']}
    },
    "production": {
        "username": "${prousername}",
        "password": "${propassword}",
        "database": "${prodatabase}",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "logging": false
    }
}`
            fs.appendFileSync(path.join(rootDir,'.env'),'\nNODE_ENV=development')
            fs.writeFile(path.join(rootDir, 'config','database.json'),(databaseJsonData), function(err, result) {
                if(err) console.log(chalk.red('ERROR:')+` File config/database.json can't be created`) 
            })
        } 
        else if(setting === 'prod'){
            databaseJsonData=`{
    "development": {
        "username": "${devusername}",
        "password": "${devpassword}",
        "database": "${devdatabase}",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "logging": false
    },
    "production": {
        "username": "${answers['username']}",
        "password": "${answers['password']}",
        "database": "${answers['database']}",
        "host": "${answers['host'] || '127.0.0.1'}",
        "dialect": "${answers['dialect'] || 'mysql'}",
        "logging": ${answers['logging']}
    }
}`
            fs.appendFileSync(path.join(rootDir,'.env'),'\nNODE_ENV=production')
            fs.writeFile(path.join(rootDir, 'config','database.json'),(databaseJsonData), function(err, result) {
                if(err) console.log(chalk.red('ERROR:')+` File config/database.json can't be created`) 
            })
        }
    })
}

function createModule(m){
    let f = fs.readdirSync(rootDir)
    if(!f.includes('api')){
        fs.mkdirSync(rootDir+'/api',{ recursive: true })
    }
    let fls = fs.readdirSync(rootDir+'/api')
    if(fls.includes(m)){
        console.log(chalk.black.bgYellowBright('WARNING:')+' '+rootDir+'/api/'+m+' already exists.')
    } else {
    fs.mkdir(rootDir+'/api/'+m,{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory ${m} can't be created`) 
        } 
    });
    fs.mkdir(rootDir+'/api/'+m+'/controllers',{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory ${m}/controllers can't be created`) 
        }  
    });
    fs.mkdir(rootDir+'/api/'+m+'/middlewares',{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory ${m}/middlewares can't be created`)  
        }  
    });
    fs.mkdir(rootDir+'/api/'+m+'/functions',{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory ${m}/functions can't be created`)  
        }  
    });
    fs.mkdir(rootDir+'/api/'+m+'/services',{ recursive: true }, (err) => { 
        if (err) { 
            console.log(chalk.red('ERROR:')+` Directory ${m}/services can't be created`)  
        } 
    });
    if(!fs.existsSync(rootDir+'/api/'+m+'/routes.json')) {
        fs.writeFile(path.join(rootDir, 'api', m, 'routes.json'),'[]', function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File ${m}/routes.json can't be created`) 
        })
    }
    if(!fs.existsSync(rootDir+'/api/'+m+'/controllers/'+m+'.js')) {
        fs.writeFile(path.join(rootDir, 'api', m, 'controllers',m+'.js'),`module.exports = {\n ${m}: (req,res)=> {\n  console.log("This is api ${m}")\n  res.send('This is api ${m}')\n }\n}`, function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File ${m}/controllers/${m}.js can't be created`) 
        })
    }
    if(!fs.existsSync(rootDir+'/api/'+m+'/middlewares/'+m+'.js')) {
        fs.writeFile(path.join(rootDir, 'api', m, 'middlewares',m+'.js'),`module.exports = {\n ${m}: (req,res,next)=> {\n  console.log("This is middleware ${m}")\n  res.send('This is middleware ${m}')\n  next();\n }\n}`, function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File ${m}/middlewares/${m}.js can't be created`) 
        })
    }
    if(!fs.existsSync(rootDir+'/api/'+m+'/functions/'+m+'.js')) {
        fs.writeFile(path.join(rootDir, 'api', m, 'functions',m+'.js'),`module.exports = {\n ${m}: ()=> {\n  console.log("This is function ${m}")\n }\n}`, function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File ${m}/functions/${m}.js can't be created`) 
        })
    }
    if(!fs.existsSync(rootDir+'/api/'+m+'/services/'+m+'.js')) {
        fs.writeFile(path.join(rootDir, 'api', m, 'services',m+'.js'),`module.exports = {\n ${m}: (req,res)=> {\n  console.log("This is service ${m}")\n  res.send('This is service ${m}')\n }\n}`, function(err, result) {
            if(err) console.log(chalk.red('ERROR:')+` File ${m}/services/${m}.js can't be created`) 
        })
    }
console.log(chalk.green(m+' module is created.'))
}
}

function createApi(moduule){
    var questions = [
        {
          type: 'input',
          name: 'path',
          message: "Enter Path(endpoint): "
        },
        {
            type: 'list',
            name: 'method',
            message: "Enter Method: ",
            choices: [{name: 'get', value: 'get'},{name: 'post', value: 'post'},{name: 'put', value: 'put'},{name: 'patch', value: 'patch'},{name: 'delete', value: 'delete'}]
        },
        {
            type: 'input',
            name: 'action',
            message: "Enter controller (in 'FileName.FunctionName' format): ",
            validate: function( value ) {
                if (value.length) {
                  return true;
                } else {
                  return "Enter controller (in 'FileName.FunctionName' format): ";
                }
            }
        },
        {
            type: 'input',
            name: 'middlewares',
            message: "Enter middlewares (FileName.FunctionName,FileName.FunctionName,..): "
        },
        {
            type: 'input',
            name: 'globalMiddleware',
            message: "Enter global middleware (FileName.FunctionName,FileName.FunctionName,..): "
        },
        {
            type: 'confirm',
            name: 'public',
            message: "API's access would be Public? : ",
            default: true
        },
        {
            type: 'confirm',
            name: 'root',
            message: "Call from root? ",
            default: false
        }
    ]
    inquirer.prompt(questions).then(answers => {
        var pathh = answers['path'][0] === '/' ? answers['path'] : '/'+answers['path']
        var method = answers['method']
        checkPath(moduule,pathh,answers['root'],method).then((jsonData)=>{
            
            for(obj of jsonData){
                if(obj['path']===pathh && obj['root']===answers['root'] && obj['method']===method){
                    console.log(chalk.res('ERROR:')+' This path has been used already..')
                    return '';
                }
            } 
            if(answers['action'].length === 0){
                return 0
            }
            if(!answers['action'].match(/[A-Za-z0-9]/) || !answers['action'].includes('.') || !answers['action'].split('.')[0] || !answers['action'].split('.')[1] || answers['action'].length === 0){
                console.log(chalk.red('ERROR:')+' Action is not defined in valid format')
                return 0
            }
            let fll = fs.readdirSync(path.join(rootDir,'api',moduule,'controllers'))
            if(fll.includes(answers['action'].split('.')[0]+'.js')){
                let apiData = require(path.join(rootDir,'api',moduule,'controllers',answers['action'].split('.')[0]+'.js'))
                for(i in (apiData)){
                    if(i.toString().toLowerCase() === answers['action'].split('.')[1].toString().toLowerCase()){
                        console.log(chalk.red('ERROR:')+' api '+answers['action'].split('.')[1]+' name is already exists in '+answers['action'].split('.')[0]+'.js')
                        return ''
                    }
                }
            }
            if(answers['middlewares']){
                if(!answers['middlewares'].match(/[A-Za-z0-9]/) || !answers['middlewares'].includes('.') || answers['middlewares'].length === 0){
                    console.log(chalk.red('ERROR:')+' Middleware is not defined in valid format')
                    return ''
                }
                let middle = answers['middlewares'].split(',')
                var middleware = []
                for(n of middle){
                    if(n.split('.')[0] === '' || n.split('.')[1] === '' || (!n.includes('.'))){
                        console.log(chalk.red('ERROR:')+' Middleware is not defined in valid format')
                        return ''
                    }
                    middleware.push(n)
                }
            }
            if(answers['globalMiddleware']){
                if(!answers['globalMiddleware'].match(/[A-Za-z0-9]/) || !answers['globalMiddleware'].includes('.') || answers['globalMiddleware'].length === 0){
                    console.log(chalk.red('ERROR:')+' Middleware is not defined in valid format')
                    return ''
                }
                let gmiddle = answers['globalMiddleware'].split(',')
                var globalMiddleware = []
                for(n of gmiddle){ 
                    if(n.split('.')[0] === '' || n.split('.')[1] === '' || (!n.includes('.'))){
                        console.log(chalk.red('ERROR:')+' Global Middleware is not defined in valid format')
                        return ''
                    }
                    globalMiddleware.push(n)
                }
            }
            actionConfigure(answers['action'],moduule)
            // var middleware = middlewareConfigure(answers['middlewares'],moduule)
            middlewareConfigure(answers['middlewares'],moduule)
            if(middleware === ''){
                return ''
            }
            // var globalMiddleware = globalMiddlewareConfigure(answers['globalMiddleware'])
            globalMiddlewareConfigure(answers['globalMiddleware'])
            if(globalMiddleware === ''){
                return ''
            }
            
            var obj = {"path": pathh, "method": method, "action": answers['action'], "middlewares": middleware, "globalMiddleware": globalMiddleware , "public": answers['public'], "root": answers['root']}
            if(!fs.existsSync(path.join(rootDir,'api',moduule,'routes.json'))){
                fs.writeFileSync(path.join(rootDir,'api',moduule,'routes.json'),'')
            }
            var dataa;
            fs.readFile(path.join(rootDir, 'api',moduule,'routes.json'), (err, data) => {
                if (err) console.log(chalk.red('ERROR:')+' Error coming in reading the api/'+moduule+'/routes.json file');
                if(data.length===0){
                    let d = []
                    d.push(obj)
                    fs.writeFile(path.join(rootDir, 'api',moduule,'routes.json'),JSON.stringify(d,null," "),'utf8', function(err, result) {
                        if(err) console.log(chalk.red('ERROR:')+' Error coming in writing the api/'+moduule+'/routes.json file');
                    })
                } else {
                    dataa = JSON.parse(data);
                    if(Array.isArray(dataa)){
                        dataa.push(obj)
                        fs.writeFile(path.join(rootDir, 'api',moduule,'routes.json'),JSON.stringify(dataa,null," "),'utf8', function(err, result) {
                            if(err) console.log(chalk.red('ERROR:')+' Error coming in writing the api/'+moduule+'/routes.json file');
                        })
                    } else {
                        var d = [];
                        d.push(dataa)
                        d.push(obj)
                        fs.writeFile(path.join(rootDir, 'api',moduule,'routes.json'),JSON.stringify(d,null," "),'utf8', function(err, result) {
                            if(err) console.log(chalk.red('ERROR:')+' Error coming in writing the api/'+moduule+'/routes.json file');
                        })
                    }
                }
            });
            
        })
    })
}

async function checkPath(moduule,pathh,root,method){
    return new Promise((resolve,reject)=>{
    let jsonData = require(path.join(rootDir,'api',moduule,'routes.json'))
    resolve(jsonData)
})
}

function actionConfigure(action,moduule){
    if(action.length === 0){
        return 0
    }
    if(!action.match(/[A-Za-z0-9]/) || !action.includes('.') || action.length === 0){
        console.log(chalk.red('ERROR:')+' Action is not defined in valid format')
        return 0
    }
    let fileName = action.toString().split('.')[0] 
        if(!fs.existsSync(path.join(rootDir,'api',moduule,'controllers',fileName+'.js'))){
            fs.readdir(path.join(rootDir,'api',moduule),function(err,files){
                if(!files.includes('controllers')){
                    fs.mkdir(path.join(rootDir, 'api', moduule, 'controllers'),{ recursive: true }, (err) => { 
                        if (err) { 
                            console.log(chalk.red('ERROR:')+' Directory api/'+moduule+'/controllers can\'t br created');
                            return 0
                        }  
                    });
                }
            })  
            let funName = action.toString().split('.')[1] 
            let obj = {}
            obj[funName]= (req,res)=>{}               
            fs.writeFile(path.join(rootDir,'api',moduule,'controllers',fileName+'.js'),`module.exports = {\n ${funName}: (req,res)=> {\n  console.log("This is api ${funName}")\n  res.send('This is api ${funName}')\n }\n}`,'utf8', function(err, result) {
                if(err) {console.log(chalk.red('ERROR:')+' Error coming in writing the api/'+moduule+'/controllers/'+fileName+'.js file'); return 0;}
            })
        } else {
            
            fs.readFile(path.join(rootDir,'api',moduule,'controllers',action.split('.')[0]+'.js'),'utf8',(err,data)=>{
                if(data.length === 0 || !data.includes("module.exports")){
                    fs.writeFile(path.join(rootDir,'api',moduule,'controllers',action.split('.')[0]+'.js'),`module.exports = {\n ${action.split('.')[1]}: (req,res)=> {\n  console.log("This is api ${action.split('.')[1]}")\n  res.send("This is api ${action.split('.')[1]}")\n }\n}`,'utf8', function(err, result) {
                        if(err) {console.log(chalk.red('ERROR:')+' Error coming in writing the api/'+moduule+'/controllers/'+action.split('.')[0]+'.js file'); return 0;}
                    })
                } else {
                    // let apiData = require(path.join(rootDir,'api',moduule,'controllers',action.split('.')[0]+'.js'))
                    // for(i in (apiData)){
                    //     if(i.toString().toLowerCase() === action.split('.')[1].toString().toLowerCase()){
                    //         console.log(chalk.black.bgYellowBright('WARNING:')+' api '+action.split('.')[1]+' name is already exists in '+action.split('.')[0]+'.js')
                    //         return 0
                    //     }
                    // }
                    if(data.slice(-1)==='}'){
                        let str = data.slice(0, -1)
                        str += `,\n${action.toString().split('.')[1]}: (req,res)=> {\n  console.log("This is api ${action.toString().split('.')[1]}")\n  res.send("This is api ${action.toString().split('.')[1]}")\n }\n}`  
                        fs.writeFile(path.join(rootDir,'api',moduule,'controllers',action.toString().split('.')[0]+'.js'),str,'utf8',function(err,result){
                            if(err) {console.log(chalk.red('ERROR:')+' Error coming in writing the api/'+moduule+'/controllers/'+action.split('.')[0]+'.js file'); return 0;}
                        })
                    }
                }
            })
        }
}

function middlewareConfigure(middlewares,moduule){
    if(middlewares.length === 0){
        return []
    }
    if(!middlewares.match(/[A-Za-z0-9]/) || !middlewares.includes('.') || middlewares.length === 0){
        console.log(chalk.red('ERROR:')+' Middleware is not defined in valid format')
        return []
    }
    if(!middlewares.toString().includes(',')){
        var middlewareArr = []
        middlewareArr.push(middlewares)
    } else {
        var middlewareArr = middlewares.toString().split(',')
    }
    let middleware = []
    for(m of middlewareArr){
        if(m.split('.')[0] === '' || m.split('.')[1] === '' || (!m.includes('.'))){
            console.log(chalk.red('ERROR:')+' Middleware is not defined in valid format')
            return []
        }
        middleware.push(m)
        if(!fs.existsSync(path.join(rootDir,'api',moduule,'middlewares',m.split('.')[0]+'.js'))){
            let files = fs.readdirSync(path.join(rootDir,'api',moduule))
                if(!files.includes('middlewares')){
                    fs.mkdirSync(path.join(rootDir,'api',moduule,'middlewares'),{ recursive: true })
                }
                let funName = m.split('.')[1]                
                fs.writeFileSync(path.join(rootDir,'api',moduule,'middlewares',m.split('.')[0]+'.js'),`module.exports = {\n ${funName}: (req,res,next)=> {\n  console.log("This is middleware ${funName}")\n  res.send("This is middleware ${funName}")\n  next();\n }\n}`,'utf8')
            
        } else {
            let data = fs.readFileSync(path.join(rootDir,'api',moduule,'middlewares',m.split('.')[0]+'.js'),'utf8')
            if(data.length === 0 || !data.includes("module.exports")){
                fs.appendFileSync(path.join(rootDir,'api',moduule,'middlewares',m.split('.')[0]+'.js'),`module.exports = {\n ${m.split('.')[1]}: (req,res,next)=> {\n  console.log("This is middleware ${m.split('.')[1]}")\n  res.send("This is middleware ${m.split('.')[1]}")\n  next();\n }\n}`,'utf8')
            } else {
                let middlewareData = require(path.join(rootDir,'api',moduule,'middlewares',m.split('.')[0]+'.js'))
                for(j in (middlewareData)){
                    if(j.toString().toLowerCase() === m.split('.')[1].toString().toLowerCase()){
                        console.log(chalk.black.bgYellowBright('WARNING:')+' '+m.split('.')[1]+' middleware is already exists in '+m.split('.')[0]+'.js')
                        return ''
                    }
                }
                if(data.toString().charAt(data.length-1)==='}'){
                    const lastParanthesis=data.toString().lastIndexOf('}')
                    let str = data.slice(0,lastParanthesis);
                    str += `,\n${m.toString().split('.')[1]}: (req,res,next)=> {\n  console.log("This is middleware ${m.toString().split('.')[1]}")\n  res.send("This is middleware ${m.toString().split('.')[1]}")\n  next();\n }\n}`  
                    fs.writeFileSync(path.join(rootDir,'api',moduule,'middlewares',m.toString().split('.')[0]+'.js'),str,'utf8')
                }
            }   
        }
    }
    return middleware
}

function globalMiddlewareConfigure(globalMiddleware){
    if(globalMiddleware.length === 0){
        return []
    }
    if(!globalMiddleware.match(/[A-Za-z0-9]/) || !globalMiddleware.includes('.')){
        console.log(chalk.red('ERROR:')+' globalMiddleware is not defined in valid format')
        return []
    }
    if(!globalMiddleware.toString().includes(',')){
        var middlewareArr = []
        middlewareArr.push(globalMiddleware)
    } else {
        var middlewareArr = globalMiddleware.toString().split(',')
    }
    let middleware = []
    for(m of middlewareArr){
        if(m.split('.')[0] === '' || m.split('.')[1] === '' || (!m.includes('.'))){
            console.log(chalk.red('ERROR:')+' Global Middleware is not defined in valid format')
            return []
        }
        middleware.push(m)
        if(!fs.existsSync(path.join(rootDir,'middlewares',m.split('.')[0]+'.js'))){
            let files = fs.readdirSync(path.join(rootDir))
                if(!files.includes('middlewares')){
                    fs.mkdirSync(path.join(rootDir,'middlewares'),{ recursive: true })
                }
                let funName = m.split('.')[1]                
                fs.writeFileSync(path.join(rootDir,'middlewares',m.split('.')[0]+'.js'),`module.exports = {\n ${funName}: (req,res,next)=> {\n  console.log("This is global middleware ${funName}")\n  res.send("This is global middleware ${funName}")\n  next();\n }\n}`,'utf8')
            
        } else {
            let data = fs.readFileSync(path.join(rootDir,'middlewares',m.split('.')[0]+'.js'),'utf8')
            if(data.length === 0 || !data.includes("module.exports")){
                fs.appendFileSync(path.join(rootDir,'middlewares',m.split('.')[0]+'.js'),`module.exports = {\n ${m.split('.')[1]}: (req,res,next)=> {\n  console.log("This is global middleware ${m.split('.')[1]}")\n  res.send("This is global middleware ${m.split('.')[1]}")\n  next();\n }\n}`,'utf8')
            } else {
                let middlewareData = require(path.join(rootDir,'middlewares',m.split('.')[0]+'.js'))
                for(j in (middlewareData)){
                    if(j.toString().toLowerCase() === m.split('.')[1].toString().toLowerCase()){
                        console.log(chalk.black.bgYellowBright('WARNING:')+' '+m.split('.')[1]+' global middleware is already exists in '+m.split('.')[0]+'.js')
                        return ''
                    }
                }
                if(data.toString().charAt(data.length-1)==='}'){
                    var lastParanthesis=data.toString().lastIndexOf('}')
                    let str = data.slice(0,lastParanthesis);
                    str += `,\n${m.toString().split('.')[1]}: (req,res,next)=> {\n  console.log("This is global middleware ${m.toString().split('.')[1]}")\n  res.send("This is global middleware ${m.toString().split('.')[1]}")\n  next();\n }\n}`  
                    fs.writeFileSync(path.join(rootDir,'middlewares',m.toString().split('.')[0]+'.js'),str,'utf8')
                }
            }
        }
    }
    return middleware
}

function createMiddleware(moduule){
    fs.readdir(path.join(rootDir,'api',moduule),(err,files)=>{
        if(!files.includes('middlewares')){
            fs.mkdirSync(path.join(rootDir,'api',moduule,'middlewares'),{recursive: true})
        }
    })
    let jsonData = require(path.join(rootDir,'api',moduule,'routes.json'))
    let queChoice = []
    Object.values(jsonData).forEach(obj=> {
        queChoice.push("path: "+obj['path']+", action: "+obj['action']+", method:"+obj['method'])
    })
    if(queChoice.length !== 0){
        let ques = [
            {
                type: 'list',
                name: 'apis',
                message: "Enter api name:",
                choices: queChoice
            },
            {
                type: 'input',
                name: 'middleware',
                message: 'Enter name of middleware:',
            }
        ]
        inquirer.prompt(ques).then(answers => {
            if(answers['middleware'].length === 0){
                return []
            }
            if(!answers['middleware'].match(/[A-Za-z0-9]/) || !answers['middleware'].includes('.') || !answers['middleware'].split('.')[0] || !answers['middleware'].split('.')[1] || answers['middleware'].length === 0){
                console.log(chalk.red('ERROR:')+' Middleware is not defined in valid format')
                return []
            }
            let pathh = answers['apis'].toString().split(',')[0].split(': ')[1]
            let action = answers['apis'].toString().split(',')[1].split(': ')[1]
            Object.values(jsonData).forEach(obj=> {
                if(obj['path'] === pathh && obj['action'] === action){
                    if(!('middlewares' in obj) || obj['middlewares'] === "" || obj['middlewares'].length===0){
                        let ar = []
                        if(answers['middleware'].includes(',')){
                            obj['middlewares'] = answers['middleware'].split(',')
                        } else {
                            ar.push(answers['middleware'])
                            obj['middlewares'] = ar
                        }
                    } else if(Array.isArray(obj['middlewares']) && answers['middleware'].includes(',')){
                        obj['middlewares'] = obj['middlewares'].concat(answers['middleware'].split(','))
                    } else if(Array.isArray(obj['middlewares'])){
                        obj['middlewares'].push(answers['middleware']) 
                    } else {
                        let arr = []
                        arr.push(obj['middlewares'])
                        arr.push(answers['middleware'])
                    }
                }
            })
            fs.writeFileSync(path.join(rootDir,'api',moduule,'routes.json'),JSON.stringify(jsonData,null," "))
            middlewareConfigure(answers['middleware'],moduule)
        })
    } else {
        console.log(chalk.red('ERROR:')+' There is no api. Create api with "framework create-api"')
    }
}

function createGlobalMiddleware(moduule){
    fs.readdir(path.join(rootDir),(err,files)=>{
        if(!files.includes('middlewares')){
            fs.mkdirSync(path.join(rootDir,'middlewares'),{recursive: true})
        }
    })
    let jsonData = require(path.join(rootDir,'api',moduule,'routes.json'))
    let queChoice = []
    Object.values(jsonData).forEach(obj=> {
        queChoice.push("path: "+obj['path']+", action: "+obj['action']+", method:"+obj['method'])
    })
    if(queChoice.length !== 0){
        let ques = [
            {
                type: 'list',
                name: 'apis',
                message: "Enter api name:",
                choices: queChoice
            },
            {
                type: 'input',
                name: 'middleware',
                message: 'Enter name of global middleware:',
            }
        ]
        inquirer.prompt(ques).then(answers => {
            if(answers['middleware'].length === 0){
                return []
            }
            if(!answers['middleware'].match(/[A-Za-z0-9]/) || !answers['middleware'].includes('.') || !answers['middleware'].split('.')[0] || !answers['middleware'].split('.')[1] || answers['middleware'].length === 0){
                console.log(chalk.red('ERROR:')+' Global Middleware is not defined in valid format')
                return []
            }
            let pathh = answers['apis'].toString().split(',')[0].split(': ')[1]
            let action = answers['apis'].toString().split(',')[1].split(': ')[1]
            Object.values(jsonData).forEach(obj=> {
                if(obj['path'] === pathh && obj['action'] === action){
                    if(!('globalMiddleware' in obj) || obj['globalMiddleware'] === "" || obj['globalMiddleware'].length===0){
                        let ar = []
                        if(answers['middleware'].includes(',')){
                            obj['globalMiddleware'] = answers['middleware'].split(',')
                        } else {
                            ar.push(answers['middleware'])
                            obj['globalMiddleware'] = ar
                        }
                    } else if(Array.isArray(obj['globalMiddleware']) && answers['middleware'].includes(',')){
                        obj['globalMiddleware'] = obj['globalMiddleware'].concat(answers['middleware'].split(','))
                    } else if(Array.isArray(obj['globalMiddleware'])){
                        obj['globalMiddleware'].push(answers['middleware']) 
                    } else {
                        let arr = []
                        arr.push(obj['globalMiddleware'])
                        arr.push(answers['middleware'])
                    }
                }
            })
            fs.writeFileSync(path.join(rootDir,'api',moduule,'routes.json'),JSON.stringify(jsonData,null," "))
            globalMiddlewareConfigure(answers['middleware'],moduule)
        })
    } else {
        console.log(chalk.red('ERROR:')+' There is no api. Create api with "framework create-api"')
    }
}

function createFunction(mdl){
    let files = fs.readdirSync(path.join(rootDir,'api',mdl))
    if(!files.includes('functions')){
        fs.mkdirSync(path.join(rootDir,'api',mdl,'functions'))
    }
    inquirer.prompt({
        type: 'input',
        name: 'functions',
        message: 'Enter functions (in "fileName.functionName,fileName.functionName,.." format:'
    }).then(answer=>{
        if(answer['functions'].length === 0){
            return ''
        }
        if(answer['functions'].includes(',')){
            var functionArr = answer['functions'].split(',')
        } else {
            var functionArr = []
            functionArr.push(answer['functions'])
        }
        for(f of functionArr){
            if(!f.match(/[A-Za-z0-9]/) || !f.includes('.') || !f.split('.')[0] || !f.split('.')[1]){
                console.log(chalk.red('ERROR:')+' Function is not defined in valid format')
                return ''
            }
            let fls = fs.existsSync(path.join(rootDir,'api',mdl,'functions',f.split('.')[0]+'.js'))
            if(!fls){
                fs.writeFileSync(path.join(rootDir,'api',mdl,'functions',f.split('.')[0]+'.js'),`module.exports = {\n ${f.split('.')[1]}: (req,res)=> {\n  console.log("This is function ${f.split('.')[1]}")\n  res.send("This is function ${f.split('.')[1]}")\n  }\n}`,'utf8')
            } else {
                let data = fs.readFileSync(path.join(rootDir,'api',mdl,'functions',f.split('.')[0]+'.js'),'utf8')
                if(data.length === 0 || !data.includes("module.exports")){
                    fs.appendFileSync(path.join(rootDir,'api',mdl,'functions',f.split('.')[0]+'.js'),`module.exports = {\n ${f.split('.')[1]}: (req,res)=> {\n  console.log("This is function ${f.split('.')[1]}")\n  res.send("This is function ${f.split('.')[1]}")\n  }\n}`,'utf8')
                } else {
                    let functionData = require(path.join(rootDir,'api',mdl,'functions',f.split('.')[0]+'.js'))
                    for(j in (functionData)){
                        if(j.toString().toLowerCase() === f.split('.')[1].toString().toLowerCase()){
                            console.log(chalk.black.bgYellowBright('WARNING:')+' '+f.split('.')[1]+' function is already exists in '+f.split('.')[0]+'.js')
                            return ''
                        }
                    }
                    if(data.toString().charAt(data.length-1)==='}'){
                        const lastParanthesis=data.toString().lastIndexOf('}')
                        let str = data.slice(0,lastParanthesis);
                        str += `,\n${f.toString().split('.')[1]}: (req,res)=> {\n  console.log("This is function ${f.toString().split('.')[1]}")\n  res.send("This is function ${f.toString().split('.')[1]}")\n  }\n}`  
                        fs.writeFileSync(path.join(rootDir,'api',mdl,'functions',f.toString().split('.')[0]+'.js'),str,'utf8')
                    }
                } 
            }
        }
    })
}

function createGlobalFunction(){
    let files = fs.readdirSync(path.join(rootDir))
    if(!files.includes('functions')){
        fs.mkdirSync(path.join(rootDir,'functions'))
    }
    inquirer.prompt({
        type: 'input',
        name: 'functions',
        message: 'Enter functions (in "fileName.functionName,fileName.functionName,.." format):'
    }).then(answer=>{
        if(answer['functions'].length === 0){
            return ''
        }
        if(answer['functions'].includes(',')){
            var functionArr = answer['functions'].split(',')
        } else {
            var functionArr = []
            functionArr.push(answer['functions'])
        }
        for(f of functionArr){
            if(!f.match(/[A-Za-z0-9]/) || !f.includes('.') || !f.split('.')[0] || !f.split('.')[1]){
                console.log(chalk.red('ERROR:')+' Function is not defined in valid format')
                return ''
            }
            let fls = fs.existsSync(path.join(rootDir,'functions',f.split('.')[0]+'.js'))
            if(!fls){
                fs.writeFileSync(path.join(rootDir,'functions',f.split('.')[0]+'.js'),`module.exports = {\n ${f.split('.')[1]}: (req,res)=> {\n  console.log("This is global function ${f.split('.')[1]}")\n  res.send("This is global function ${f.split('.')[1]}")\n  }\n}`,'utf8')
            } else {
                let data = fs.readFileSync(path.join(rootDir,'functions',f.split('.')[0]+'.js'),'utf8')
                if(data.length === 0 || !data.includes("module.exports")){
                    fs.appendFileSync(path.join(rootDir,'functions',f.split('.')[0]+'.js'),`module.exports = {\n ${f.split('.')[1]}: (req,res)=> {\n  console.log("This is global function ${f.split('.')[1]}")\n  res.send("This is global function ${f.split('.')[1]}")\n  }\n}`,'utf8')
                } else {
                    let functionData = require(path.join(rootDir,'functions',f.split('.')[0]+'.js'))
                    for(j in (functionData)){
                        if(j.toString().toLowerCase() === f.split('.')[1].toString().toLowerCase()){
                            console.log(chalk.black.bgYellowBright('WARNING:')+' '+f.split('.')[1]+' function is already exists in '+f.split('.')[0]+'.js')
                            return ''
                        }
                    }
                    if(data.toString().charAt(data.length-1)==='}'){
                        const lastParanthesis=data.toString().lastIndexOf('}')
                        let str = data.slice(0,lastParanthesis);
                        str += `,\n${f.toString().split('.')[1]}: (req,res)=> {\n  console.log("This is global function ${f.toString().split('.')[1]}")\n  res.send("This is global function ${f.toString().split('.')[1]}")\n  }\n}`  
                        fs.writeFileSync(path.join(rootDir,'functions',f.toString().split('.')[0]+'.js'),str,'utf8')
                    }
                } 
            }
        }
    })
}

function createService(mdl){
    let files = fs.readdirSync(path.join(rootDir,'api',mdl))
    if(!files.includes('services')){
        fs.mkdirSync(path.join(rootDir,'api',mdl,'services'))
    }
    inquirer.prompt({
        type: 'input',
        name: 'services',
        message: 'Enter services (in "fileName.functionName,fileName.functionName,.." format):'
    }).then(answer=>{
        if(answer['services'].length === 0){
            return ''
        }
        if(answer['services'].includes(',')){
            var serviceArr = answer['services'].split(',')
        } else {
            var serviceArr = []
            serviceArr.push(answer['services'])
        }
        for(f of serviceArr){
            if(!f.match(/[A-Za-z0-9]/) || !f.includes('.') || !f.split('.')[0] || !f.split('.')[1]){
                console.log(chalk.red('ERROR:')+' Service is not defined in valid format')
                return ''
            }
            let fls = fs.existsSync(path.join(rootDir,'api',mdl,'services',f.split('.')[0]+'.js'))
            if(!fls){
                fs.writeFileSync(path.join(rootDir,'api',mdl,'services',f.split('.')[0]+'.js'),`module.exports = {\n ${f.split('.')[1]}: (req,res)=> {\n  console.log("This is service ${f.split('.')[1]}")\n  res.send("This is service ${f.split('.')[1]}")\n  }\n}`,'utf8')
            } else {
                let data = fs.readFileSync(path.join(rootDir,'api',mdl,'services',f.split('.')[0]+'.js'),'utf8')
                if(data.length === 0 || !data.includes("module.exports")){
                    fs.appendFileSync(path.join(rootDir,'api',mdl,'services',f.split('.')[0]+'.js'),`module.exports = {\n ${f.split('.')[1]}: (req,res)=> {\n  console.log("This is service ${f.split('.')[1]}")\n  res.semd("This is service ${f.split('.')[1]}")\n  }\n}`,'utf8')
                } else {
                    let functionData = require(path.join(rootDir,'api',mdl,'services',f.split('.')[0]+'.js'))
                    for(j in (functionData)){
                        if(j.toString().toLowerCase() === f.split('.')[1].toString().toLowerCase()){
                            console.log(chalk.black.bgYellowBright('WARNING:')+' '+f.split('.')[1]+' service is already exists in '+f.split('.')[0]+'.js')
                            return ''
                        }
                    }
                    if(data.toString().charAt(data.length-1)==='}'){
                        const lastParanthesis=data.toString().lastIndexOf('}')
                        let str = data.slice(0,lastParanthesis);
                        str += `,\n${f.toString().split('.')[1]}: (req,res)=> {\n  console.log("This is service ${f.toString().split('.')[1]}")\n  res.send("This is service ${f.toString().split('.')[1]}")\n  }\n}`  
                        fs.writeFileSync(path.join(rootDir,'api',mdl,'services',f.toString().split('.')[0]+'.js'),str,'utf8')
                    }
                } 
            }
        }
    })
}

function createGlobalService(){
    let files = fs.readdirSync(path.join(rootDir))
    if(!files.includes('services')){
        fs.mkdirSync(path.join(rootDir,'services'))
    }
    inquirer.prompt({
        type: 'input',
        name: 'services',
        message: 'Enter services (in "fileName.functionName,fileName.functionName,.." format):'
    }).then(answer=>{
        if(answer['services'].length === 0){
            return ''
        }
        if(answer['services'].includes(',')){
            var serviceArr = answer['services'].split(',')
        } else {
            var serviceArr = []
            serviceArr.push(answer['services'])
        }
        for(f of serviceArr){
            if(!f.match(/[A-Za-z0-9]/) || !f.includes('.') || !f.split('.')[0] || !f.split('.')[1]){
                console.log(chalk.red('ERROR:')+' Service is not defined in valid format')
                return ''
            }
            let fls = fs.existsSync(path.join(rootDir,'services',f.split('.')[0]+'.js'))
            if(!fls){
                fs.writeFileSync(path.join(rootDir,'services',f.split('.')[0]+'.js'),`module.exports = {\n ${f.split('.')[1]}: (req,res)=> {\n  console.log("This is global service ${f.split('.')[1]}")\n  res.send("This is global service ${f.split('.')[1]}")\n  }\n}`,'utf8')
            } else {
                let data = fs.readFileSync(path.join(rootDir,'services',f.split('.')[0]+'.js'),'utf8')
                if(data.length === 0 || !data.includes("module.exports")){
                    fs.appendFileSync(path.join(rootDir,'services',f.split('.')[0]+'.js'),`module.exports = {\n ${f.split('.')[1]}: (req,res)=> {\n  console.log("This is service ${f.split('.')[1]}")\n  res.send("This is service ${f.split('.')[1]}")\n  }\n}`,'utf8')
                } else {
                    let functionData = require(path.join(rootDir,'services',f.split('.')[0]+'.js'))
                    for(j in (functionData)){
                        if(j.toString().toLowerCase() === f.split('.')[1].toString().toLowerCase()){
                            console.log(chalk.black.bgYellowBright('WARNING:')+' '+f.split('.')[1]+' service is already exists in '+f.split('.')[0]+'.js')
                            return ''
                        }
                    }
                    if(data.toString().charAt(data.length-1)==='}'){
                        const lastParanthesis=data.toString().lastIndexOf('}')
                        let str = data.slice(0,lastParanthesis);
                        str += `,\n${f.toString().split('.')[1]}: (req,res)=> {\n  console.log("This is global service ${f.toString().split('.')[1]}")\n  res.send("This is global service ${f.toString().split('.')[1]}")\n  }\n}`  
                        fs.writeFileSync(path.join(rootDir,'services',f.toString().split('.')[0]+'.js'),str,'utf8')
                    }
                } 
            }
        }
    })
}

function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + ':' + obj[p] + '\n';
        }
    }
    return str;
}