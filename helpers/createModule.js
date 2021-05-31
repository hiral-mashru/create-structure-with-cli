const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const [,,...args] = process.argv // to parse command line arguments
const[type,...modulle] = args
const rootDir = process.cwd()

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

module.exports = createModule