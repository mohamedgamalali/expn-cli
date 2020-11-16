
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

                    } else {
                        return true;
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

        return true ;


    } catch (err) {
        if (!err.status) {
            err.status = 500;
        }
        print.error(err);
    }
}