require('dotenv').config();
var inquirer = require('inquirer');
const { Pool } = require('pg');

console.log(process.env.PASSWORD);

const pool = new Pool(
    {
        user: process.env.USER,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        database: process.env.DATABASE
    },
)

pool.connect();


const runInq = async () => {
    let answer
    try {
        answer = await inquirer.prompt([
            /* Pass your questions in here */
            {
                type: 'list', name: 'menu', choices: ['view all departments',
                    'view all roles',
                    'view all employees',
                    'add a department',
                    'add a role',
                    'add an employee',
                    'update an employee role'
                ]
            }
        ])


    } catch (error) {
        if (error.isTtyError) {
            console.error("Prompt couldn't be rendered in the current environment");
        } else {
            console.error(error);
        }
    }

    const question = []
    switch (answer.menu) {
        case 'view all roles':

        case 'view all employees':

        case 'add a department':
            question.push({ type: 'input', name: 'department', message: 'What is the department name? ' });
            break

        case 'add a role':
            question.push(
                { type: 'input', name: 'role', message: 'What is the role? ' },
                { type: 'input', name: 'salary', message: 'What is the salary ' }
            );
            break

        case 'add an employee':
            question.push(
                { type: 'input', name: 'firstName', message: 'What is the first name? ' },
                { type: 'input', name: 'lastName', message: 'What is the last name? ' },
                { type: 'input', name: 'role', message: 'What is the role? ' },
                // Will be updated to list of managers
                { type: 'input', name: 'role', message: 'Who is the employees manager? ' }
            );
            break

        case 'update an employee role':
            question.push(
                // Will be updated to list of employees
                { type: 'input', name: 'employee', message: 'Which employees role would you like to update? ' },
                // Will be updated to list of roles
                { type: 'input', name: 'roles', message: 'Which role do you want to assign? ' }
            );
            break

        default:
    }
    answer = await inquirer.prompt(question);
    console.log(answer);
};

// Will need to utilise recursion to get the function to call itself.
runInq()

