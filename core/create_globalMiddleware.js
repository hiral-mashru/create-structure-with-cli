var Spinner = require('cli-spinner').Spinner;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const Confirm = require('prompt-confirm')
const rootDir = process.cwd()
const download = require('download-git-repo')
const inquirer = require('inquirer');
const { program } = require('commander');
const createGlobalMiddleware = require('../helpers/createGlobalMiddleware')

function create_globalMiddleware(){
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
}

module.exports = create_globalMiddleware