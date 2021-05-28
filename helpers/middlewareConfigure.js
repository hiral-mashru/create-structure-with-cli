var Spinner = require('cli-spinner').Spinner;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const Confirm = require('prompt-confirm')
const rootDir = process.cwd()
const download = require('download-git-repo')
const inquirer = require('inquirer');
const { program } = require('commander');

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

module.exports = middlewareConfigure