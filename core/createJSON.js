var Spinner = require('cli-spinner').Spinner;
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const Confirm = require('prompt-confirm')
const [,,...args] = process.argv // to parse command line arguments
const[type,...modulle] = args
const rootDir = process.cwd()
const download = require('download-git-repo')
const inquirer = require('inquirer');

function createJSON(setting){
    var questions = [
        {
          type: 'input',
          name: 'username',
          message: "Enter username: ",
          validate: function( value ) {
            if (value.length) {
              return true;
            } else {
              return 'Enter the username: ';
            }
          }
        },
        {
            type: 'password',
            name: 'password',
            message: "Enter password: "
        },
        {
            type: 'input',
            name: 'database',
            message: "Enter database name: ",
            validate: function( value ) {
                if (value.length) {
                  return true;
                } else {
                  return 'Enter dataase name:';
                }
              }
        },
        {
            type: 'input',
            name: 'host',
            message: "Enter host: "
        },
        {
            type: 'input',
            name: 'dialect',
            message: "Enter dialect: "
        },
        {
            type: 'confirm',
            name: 'logging',
            message: "Enter logging: ",
            default: false
        }
    ]
    inquirer.prompt(questions).then(answers => {
        if(setting === 'dev'){
            databaseJsonData=`{
    "development": {
        "username": "${answers['username']}",
        "password": "${answers['password']}",
        "database": "${answers['database']}",
        "host": "${answers['host'] || '127.0.0.1'}",
        "dialect": "${answers['dialect'] || 'mysql'}",
        "logging": ${answers['logging']}
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
            // fs.writeFile(path.join(rootDir, 'config','database.json'),"{\"development\":{\"username\":\""+answers['username']+"\",\"password\":\""+answers['password']+"\",\"database\":\""+answers['database']+"\",\"host\":\""+answers['host']+"\",\"dialect\":\""+answers['dialect']+"\",\"logging\":"+answers['logging']+"}}", function(err, result) {
            //     if(err) console.log(chalk.red('ERROR:')+` File config/database.json can't be created`) 
            // })
            fs.writeFile(path.join(rootDir, 'config','database.json'),(databaseJsonData), function(err, result) {
                if(err) console.log(chalk.red('ERROR:')+` File config/database.json can't be created`) 
            })
        } 
        else if(setting === 'prod'){
            databaseJsonData=`{
    "development": {
        "username": "${devusername}",
        "password": "${devpassword}",
        "database": "${devdatabase}",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "logging": false
    },
    "production": {
        "username": "${answers['username']}",
        "password": "${answers['password']}",
        "database": "${answers['database']}",
        "host": "${answers['host'] || '127.0.0.1'}",
        "dialect": "${answers['dialect'] || 'mysql'}",
        "logging": ${answers['logging']}
    }
}`
            fs.writeFile(path.join(rootDir, 'config','database.json'),(databaseJsonData), function(err, result) {
                if(err) console.log(chalk.red('ERROR:')+` File config/database.json can't be created`) 
            })
        }
    })
}

module.exports = createJSON