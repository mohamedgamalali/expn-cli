
const print = require('./print');
const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');


exports.checkForExpress = async (dir) => {
    try {
        //first =>> check for package.json whitch means we need 'npm init' if not found
        if (fs.existsSync(path.join(`${dir}/package.json`))) {
            fs.readFile(`${dir}/package.json`, 'utf8', (err, data) => {
                try {
                    const opj = JSON.parse(data);
                    if (!opj.dependencies || !opj.dependencies.express) {

                        spawn.sync('npm', ['i', 'express'], { stdio: 'inherit' });

                    }
                } catch (e) {
                    if (!err.status) {
                        err.status = 500;
                    }
                    print.error(err);
                }

            });
        } else {
            spawn.sync('npm', ['init'], { stdio: 'inherit' });
            spawn.sync('npm', ['i', 'express'], { stdio: 'inherit' });
        }


    } catch (err) {
        if (!err.status) {
            err.status = 500;
        }
        print.error(err);
    }
}

exports.addRouter = async (dir, name, mainPath) => {
    try {

        if (mainPath.indexOf('/') != 0) {
            const err = new Error('main path must start with "/"')
            err.status = 502;
            throw err;
        }
        fs.readFile(`${dir}/package.json`, 'utf8',async (err, data) => {
            try {

                const opj = JSON.parse(data);
                const mainFile = opj.main;

                if (fs.existsSync(path.join(`${dir}/${mainFile}`))) { //case 2
                    console.log("ddd");
                    await createFolders(dir,name);
                    
                } else {    //case 1
                
                    await createFolders(dir,name);

                    const mainFileContent = `const express = require('express');
const app = express();


const ${name}Router = require('./routes/${name}.js');
app.use('${mainPath}', ${name}Router);
app.listen(3000,()=>{
    console.log('listen to 3000..');
});`;
                    fs.writeFile(mainFile, mainFileContent, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                    print.success(`Route created with main path ${mainPath}`)

                }
                
            } catch (e) {
                if (!err.status) {
                    err.status = 500;
                }
                print.error(err);
            }

        });

    } catch (err) {
        if (!err.status) {
            err.status = 500;
        }
        print.error(err);
    }
}


const createFolders = async (dir, name) => {

    try {
        
        if (!fs.existsSync(path.join(`${dir}/controllers`))) {
            fs.mkdirSync('controllers');
            fs.writeFile(path.join(`${dir}/controllers/${name}.js`), '', (err) => {
                if (err) {
                    throw err;
                }
            });
        } else {
            if (fs.existsSync(path.join(`${dir}/controllers/${name}.js`))) {
                const err = new Error('route already created!!.. \none controller file with the same name')
                err.status = 501;
                throw err;
            } else {
                fs.writeFile(path.join(`${dir}/controllers/${name}.js`), '', (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
        //create routes folder
        const newRouteFileContent = `const express      = require('express');
    
const ${name}Controller = require('../controllers/${name}.js');
    
const router  = express.Router();
    
module.exports = router;
        `
        if (!fs.existsSync(path.join(`${dir}/routes`))) {
            fs.mkdirSync('routes');
            fs.writeFile(`${dir}/routes/${name}.js`, newRouteFileContent, (err) => {
                if (err) {
                    throw err;
                }
            });
        } else {
            if (fs.existsSync(path.join(`${dir}/routes/${name}.js`))) {
                const err = new Error('route already created!!.. \none route file with the same name')
                err.status = 501;
                throw err;
            }
            fs.writeFile(`${dir}/routes/${name}.js`, newRouteFileContent, (err) => {
                if (err) {
                    throw err;
                }
            });
        }
    } catch (err) {
        if (!err.status) {
            err.status = 500;
        }
        print.error(err);
    }



}