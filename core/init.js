var Spinner = require('cli-spinner').Spinner;
const fs = require('fs');
const chalk = require('chalk')
const Confirm = require('prompt-confirm')
const [,,...args] = process.argv // to parse command line arguments
const rootDir = process.cwd()
const download = require('download-git-repo')
const createStructure = require('../helpers/createStructure')

function init(){
fs.readdir(rootDir, function(err, files){
    if(files.length){
        new Confirm({message: 'You have already done initialization. Do you want to do init?', default: false})
        .run()
        .then(function(answer){
            if(answer){
                var spinner = new Spinner('processing.. %s');
                spinner.setSpinnerString('|/-\\');
                spinner.start();
                download('hiral-mashru/boilerplate-structure', rootDir, function (err) {
                    flag = true
                    console.log(err ? chalk.red('Error in downloading folder structure') : chalk.green('Success'))
                    spinner.stop(true)
                    if(!err){
                        createStructure()
                    }
                })
            }
        })
    } else {
        var spinner = new Spinner('processing.. %s');
        spinner.setSpinnerString('|/-\\');
        spinner.start();
        download('hiral-mashru/boilerplate-structure', rootDir, function (err) {
            flag = true
            console.log(err ? chalk.red('Error in downloading folder structure') : chalk.green('Success'))
            spinner.stop(true)
            if(!err){
                createStructure()
            }
        })
    }
})
}

module.exports = init