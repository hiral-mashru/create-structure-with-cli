const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const rootDir = process.cwd()
const inquirer = require('inquirer');

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

module.exports = createGlobalFunction