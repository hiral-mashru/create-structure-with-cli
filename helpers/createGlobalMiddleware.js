var Spinner = require('cli-spinner').Spinner;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const Confirm = require('prompt-confirm')
const rootDir = process.cwd()
const download = require('download-git-repo')
const inquirer = require('inquirer');
const { program } = require('commander');
const globalMiddlewareConfigure = require('./globalMiddlewareConfigure')

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

module.exports = createGlobalMiddleware