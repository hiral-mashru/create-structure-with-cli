const fs = require('fs');
const Confirm = require('prompt-confirm')
const [,,...args] = process.argv // to parse command line arguments
const[type,...modulle] = args
const rootDir = process.cwd()
const createJSON = require('./createJSON')

let devusername="root";
let devpassword=null;
let devdatabase="database_development";
let prousername="root";
let propassword=null;
let prodatabase="database_production";
let databaseJsonData=`{
  "development": {
    "username": "${devusername}",
    "password": "${devpassword}",
    "database": "${devdatabase}",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "username": "${prousername}",
    "password": "${propassword}",
    "database": "${prodatabase}",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
}`

function dbConfig(){
    if(!fs.existsSync(rootDir+'/config'+'/database.json')) {
        fs.mkdirSync(rootDir+'/config', {recursive: true})
        fs.writeFileSync(rootDir+'/config/database.json',databaseJsonData)
    }
    new Confirm({message:'Do you want to setup development env?'})
        .run()
        .then(function(answer){
            if(answer){
                setting = 'dev'
                createJSON(setting)
            } else {
                console.log("Go for production env setup...")
                setting = 'prod'
                createJSON(setting)
            }
        })
}

module.exports = dbConfig