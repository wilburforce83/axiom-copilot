const wijster_totals = require("./automated_updates/wijster_totals")
const helper = require("./tools/helpers");




console.log(
    `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@%///@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@/////*@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@&//////*/#@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@(///////*///@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@&///////*///@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@&/(@//////*/%&//@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@///*/@#*///*@(/*//#@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@%///////%@///&////////@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@///////////@@%*/////////%@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@///////////#@//*//////////(@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@/*///////*//@(///*///////*////@@@@@@@@@@@@@@@
@@@@@@@@@@@@@&////////////@/////*//////////////@@@@@@@@@@@@@
@@@@@@@@@@@@////*///////&&//////*///////////////@@@@@@@@@@@@
@@@@@@@@@@@////////////@////////*////////////////%@@@@@@@@@@
@@@@@@@@@%*/*/*/*/*/*&@/*/*/*/*/*/*/*/*/*/*/*/*/*/*@@@@@@@@@
@@@@@@@@////////////@(//////////*///////////////////#@@@@@@@
@@@@@@@/////////*/#@////////////*///////////////*/////@@@@@@
@@@@@(///////////@%/////////////*//////////////////////@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

Author Will Shearer 2023 - Green Create, GC CoPilot AI v1.0

`);

async function run() {
    const { default: inquirer } = await import('inquirer');

    const periodQuestion = {
        type: 'list',
        message: 'Select a period:',
        name: 'period',
        choices: ['Day', 'Week', 'Month', 'Quit'],
    };

    const numberOfXQuestion = {
        type: 'input',
        name: 'numberOfX',
        message: answers => answers.period === 'Quit' ? 'Hit Enter to quit...' : `Enter a number of ${answers.period}s to return:`,
        validate: (input, answers) => {
            if (answers.period === 'Quit') {
                process.exit(0);
            }

            const number = parseInt(input);

            if (isNaN(number) || number <= 0) {
                return 'Please enter a valid positive number.';
            }

            return true;
        },
    };

    const emailQuestion = {
        type: 'input',
        name: 'email',
        message: 'Enter your email address:',
        validate: input => {
            // Simple email validation, adjust as needed
            if (!/\S+@\S+\.\S+/.test(input)) {
                return 'Please enter a valid email address.';
            }

            return true;
        },
    };

    const answers = await inquirer.prompt([periodQuestion, numberOfXQuestion, emailQuestion]);
    const { period, numberOfX, email } = answers;
    console.log(`You've selected to process ${numberOfX} ${period}(s), the exported data will be sent to ${email}`);
    const dates = helper.generateDateObject(numberOfX, period);
    const sendTo = answers.email;
    const startDates = dates.startDates;
    const endDates = dates.endDates;

    (async () => {
       let func = await wijster_totals(startDates, endDates, sendTo);
       run().catch(error => console.error('Error:', error));
    })();
}

run().catch(error => console.error('Error:', error));
