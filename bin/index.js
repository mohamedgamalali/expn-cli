#!/usr/bin/env node

const print = require('../helpers/print');
const Init = require('../helpers/init');

const yargs = require("yargs");

const argv = yargs
    .env()
    .command("init", "init router", {
        router: {
            describe: 'new router name',
            alias: 'r',
            demandOption: true,
            type: 'string'
        },
        mainPath: {
            describe: 'new router main path',
            alias: 'p',
            demandOption: true,
            type: 'string'
        }
    }, async (argv) => {
        try{
            
            //first  ==> check for express and pachage.json and run npm init if needed
            await Init.checkForExpress(argv.pwd);
            //console.log(check);
            //second ==> crete new router
            await Init.addRouter(argv.pwd,argv.router,argv.mainPath);
            
            
        }catch(err){
            if (!err.status) {
                err.status = 500;
            }
            print.error(err);
        }
        
    })
    .help()
    .alias('help', 'h')
    .argv;