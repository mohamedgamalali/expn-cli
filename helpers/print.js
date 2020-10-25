const chalk = require("chalk");
const boxen = require("boxen");

const success = async (message) => {
    try {
        
        const greeting = chalk.hex('#7fac81').bold(message) + " " + chalk.red.bold('<3');

        const boxenOptions = {
            padding: 1,
            margin: 5,
            borderStyle: "classic",
            borderColor: "#566d7c",

        };
        const msgBox = boxen(greeting, boxenOptions);

        console.log(msgBox);


    } catch (err) {
        if (!err.status) {
            err.status = 500;
        }
        error(err);
    }
}

const error = async (errOPj) => {
    try {
        let msg;
        if (errOPj.status == 500) {

            msg = chalk.red.bold('internal error!!');

        } else {

            msg = chalk.red.bold(errOPj.message);

        }

        console.log(msg);

    } catch (err) {
        console.log(err.message);
    }
}

exports.success = success;
exports.error = error;
