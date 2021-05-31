const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const rootDir = process.cwd()
const inquirer = require('inquirer');
const actionConfigure = require('../helpers/actionConfigure')
const middlewareConfigure = require('../helpers/middlewareConfigure')
const globalMiddlewareConfigure = require('../helpers/globalMiddlewareConfigure')

async function checkPath(moduule,pathh,root,method){
    return new Promise((resolve,reject)=>{
    let jsonData = require(path.join(rootDir,'api',moduule,'routes.json'))
    resolve(jsonData)
})
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

module.exports = createApi