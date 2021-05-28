var Spinner = require('cli-spinner').Spinner;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const Confirm = require('prompt-confirm')
const rootDir = process.cwd()
const download = require('download-git-repo')
const inquirer = require('inquirer');
const { program } = require('commander');
const middlewareConfigure = require('./middlewareConfigure')

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

module.exports = createMiddleware