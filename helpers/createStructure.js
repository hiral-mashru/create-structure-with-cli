var Spinner = require('cli-spinner').Spinner;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const Confirm = require('prompt-confirm')
const [,,...args] = process.argv // to parse command line arguments
const[type,...modulle] = args
const rootDir = process.cwd()
const download = require('download-git-repo')
const inquirer = require('inquirer');
const dbConfig = require('./dbConfig')

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

module.exports = createStructure