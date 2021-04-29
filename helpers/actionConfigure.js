var Spinner = require('cli-spinner').Spinner;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const Confirm = require('prompt-confirm')
const rootDir = process.cwd()
const download = require('download-git-repo')
const inquirer = require('inquirer');
const { program } = require('commander');

function actionConfigure(action,moduule){
    if(action.length === 0){
        return 0
    }
    if(!action.match(/[A-Za-z0-9]/) || !action.includes('.') || action.length === 0){
        console.log(chalk.red('ERROR:')+' Action is not defined in valid format')
        return 0
    }
    let fileName = action.toString().split('.')[0] 
        if(!fs.existsSync(path.join(rootDir,'api',moduule,'controllers',fileName+'.js'))){
            fs.readdir(path.join(rootDir,'api',moduule),function(err,files){
                if(!files.includes('controllers')){
                    fs.mkdir(path.join(rootDir, 'api', moduule, 'controllers'),{ recursive: true }, (err) => { 
                        if (err) { 
                            console.log(chalk.red('ERROR:')+' Directory api/'+moduule+'/controllers can\'t br created');
                            return 0
                        }  
                    });
                }
            })  
            let funName = action.toString().split('.')[1] 
            let obj = {}
            obj[funName]= (req,res)=>{}               
            fs.writeFile(path.join(rootDir,'api',moduule,'controllers',fileName+'.js'),`module.exports = {\n ${funName}: (req,res)=> {\n  console.log("This is api ${funName}")\n  res.send('This is api ${funName}')\n }\n}`,'utf8', function(err, result) {
                if(err) {console.log(chalk.red('ERROR:')+' Error coming in writing the api/'+moduule+'/controllers/'+fileName+'.js file'); return 0;}
            })
        } else {
            
            fs.readFile(path.join(rootDir,'api',moduule,'controllers',action.split('.')[0]+'.js'),'utf8',(err,data)=>{
                if(data.length === 0 || !data.includes("module.exports")){
                    fs.writeFile(path.join(rootDir,'api',moduule,'controllers',action.split('.')[0]+'.js'),`module.exports = {\n ${action.split('.')[1]}: (req,res)=> {\n  console.log("This is api ${action.split('.')[1]}")\n  res.send("This is api ${action.split('.')[1]}")\n }\n}`,'utf8', function(err, result) {
                        if(err) {console.log(chalk.red('ERROR:')+' Error coming in writing the api/'+moduule+'/controllers/'+action.split('.')[0]+'.js file'); return 0;}
                    })
                } else {
                    // let apiData = require(path.join(rootDir,'api',moduule,'controllers',action.split('.')[0]+'.js'))
                    // for(i in (apiData)){
                    //     if(i.toString().toLowerCase() === action.split('.')[1].toString().toLowerCase()){
                    //         console.log(chalk.black.bgYellowBright('WARNING:')+' api '+action.split('.')[1]+' name is already exists in '+action.split('.')[0]+'.js')
                    //         return 0
                    //     }
                    // }
                    if(data.slice(-1)==='}'){
                        let str = data.slice(0, -1)
                        str += `,\n${action.toString().split('.')[1]}: (req,res)=> {\n  console.log("This is api ${action.toString().split('.')[1]}")\n  res.send("This is api ${action.toString().split('.')[1]}")\n }\n}`  
                        fs.writeFile(path.join(rootDir,'api',moduule,'controllers',action.toString().split('.')[0]+'.js'),str,'utf8',function(err,result){
                            if(err) {console.log(chalk.red('ERROR:')+' Error coming in writing the api/'+moduule+'/controllers/'+action.split('.')[0]+'.js file'); return 0;}
                        })
                    }
                }
            })
        }
}

module.exports = actionConfigure