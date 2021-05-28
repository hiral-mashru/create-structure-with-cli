const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const rootDir = process.cwd()
const inquirer = require('inquirer');
const createModule = require('../helpers/createModule')
const createApi = require('../helpers/createApi')

function create_api(){
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
}

module.exports = create_api