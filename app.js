const wijster_totals = require("./scripts/totaliser");
const helper = require("./tools/helpers");
const tags = require("./tools/tags");
const chalk = require('chalk');
console.log(chalk.greenBright(`
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

Dev. Will Shearer 2023 - Green Create, Axiom Soft-Totals 0.6
`));

async function run() {
    const inquirer = require('inquirer');

    // New Questions
    const siteQuestion = {
        type: 'list',
        message: 'Which site do you want to process data for?',
        name: 'site',
        choices: ['Kent', 'Wijster'],
    };

    const tagsQuestion = {
        type: 'checkbox',
        message: 'Select tags to process (spacebar for multi-select):',
        name: 'selectedTags',
        choices: answers => tags[answers.site + 'References'],
        when: answers => answers.site !== undefined,
    };

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

    const questions = [siteQuestion, tagsQuestion, periodQuestion, numberOfXQuestion, emailQuestion];

    const answers = await inquirer.prompt(questions);
    const { site, selectedTags, period, numberOfX, email } = answers;

    console.log(`You've selected to process ${numberOfX} ${period}(s) at ${site}, the exported data will be sent to ${email} for the following tags:`);
        selectedTags.forEach(item => {
        console.log(chalk.green(item)); // Change color as needed
      });

    const selectedNames = helper.filterTargetArray(selectedTags,tags[answers.site + 'References'],tags[answers.site + 'Names'])
    
    // Do something with selectedTags if needed
    
    const dates = helper.generateDateObject(numberOfX, period);
    const sendTo = answers.email;
    const startDates = dates.startDates;
    const endDates = dates.endDates;

    (async () => {
        let func = await wijster_totals(startDates, endDates, sendTo,selectedTags,selectedNames);
        run().catch(error => console.error('Error:', error));
    })();
}

run().catch(error => console.error('Error:', error));
