var Spinner = require('cli-spinner').Spinner;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const Confirm = require('prompt-confirm')
const rootDir = process.cwd()
const download = require('download-git-repo')
const inquirer = require('inquirer');
const { program } = require('commander');
const createModule = require('../helpers/createModule')
const createFunction = require('../helpers/createFunction')
const createGlobalFunction = require('../helpers/createGlobalFunction')

function create_function(){
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
}

module.exports = create_function