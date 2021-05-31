const chalk = require('chalk')
const [,,...args] = process.argv // to parse command line arguments
const createModule = require('../helpers/createModule')

function create_module(modulle){
    if(modulle.length === 0){
        console.log(chalk.black.bgYellowBright('WARNING:')+' Provide module name...')
        return
    }
    for(let m of modulle){
        if(m) {
            createModule(m)
        } else {
            console.log(chalk.black.bgYellowBright('WARNING:')+' Provide module\'s name')
        }
    }
}

module.exports = create_module