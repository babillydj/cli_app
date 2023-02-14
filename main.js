import inquirer from 'inquirer'
import childProcess from 'child_process'

function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

inquirer
    .prompt([
        {
            type: 'list',
            name: 'apps',
            message: 'Please chose which application you want to use',
            choices: [
                'ATM',
                'Poker'
            ],
        },
    ])
    .then((answers) => {
        const {apps} =  answers
        if (apps === "ATM") {
            runScript('src/commands/atm.js', function (err) {
                // if (err) throw err;
                console.log('Exit App');
            });
        } else if (apps === "Poker Face") {
            runScript('src/commands/poker.js', function (err) {
                // if (err) throw err;
                console.log('Exit App');
            });
        }
    })
