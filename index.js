require('dotenv').config();
var inquirer = require('inquirer');
const { Pool } = require('pg');
const Query = require('./query');

// dot.env file referenced for security
const pool = new Pool(
    {
        user: process.env.USER,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        database: process.env.DATABASE
    },
)

pool.connect();

const query = new Query;

const runInq = async () => {
    // Declare answer variable here to allow needed scope.
    let answer
    try {
        answer = await inquirer.prompt([
            // Inquirer menu options
            {
                type: 'list', name: 'menu', choices: [
                    'view all departments',
                    'view all roles',
                    'view all employees',
                    'add a department',
                    'add a role',
                    'add an employee',
                    'update an employee role'
                ]
            }
        ])
        // Fail gracefully if error
    } catch (error) {
        if (error.isTtyError) {
            console.error("Prompt couldn't be rendered in the current environment");
        } else {
            console.error(error);
        }
    }
    // Declare an array to store folloe up questions for some routes.
    const question = []
    switch (answer.menu) {
        case 'view all departments':
            // Function to output a table of current departments.
            const viewDepartments = async () => {
                const output = await query.seeDepartments();
                console.table(output.rows)
            }
            // All functions before break use await to ensure that results are shown before new instance of main menu starts.
            await viewDepartments();
            break

        case 'view all roles':
            // Function to output a table of roles.
            const viewRoles = async () => {
                const output = await query.seeRoles();
                console.table(output.rows)
            }
            await viewRoles();
            break

        case 'view all employees':
            // Function to output a table of employees.
            const viewEmployees = async () => {
                const output = await query.seeEmployees();
                console.table(output.rows)
            }
            await viewEmployees();
            break

        case 'add a department':
            const addDep = async () => {
                // Add department follow up question to question array.
                question.push({ type: 'input', name: 'department', message: 'What is the department name? ' });
            };
            await addDep();
            break

        case 'add a role':
            // Creates array of department names. Used map array method in other paths to achieve same result.
            let allDepartments = [];
            const depList = await query.seeDepartments();

            for (deps of depList.rows) {
                allDepartments.push(deps.name);
            };
            // Add follow up role questions to question array.
            question.push(
                { type: 'input', name: 'role', message: 'What is the role? ' },
                { type: 'input', name: 'salary', message: 'What is the salary ' },
                { type: 'list', name: 'departments', choices: allDepartments }
            );
            break

        case 'add an employee':
            // Get roles data
            const result = await query.seeRoles();

            // Get manager data
            const resultMan = await query.seeManagers();

            // Convert to an array of manager names to be used as list question
            const managerList = resultMan.rows.map(el => el.manager);

            // Convert to an array of roles to be used as list question
            const roleList = result.rows.map(el => el.title);

            // Add follow up employee questions to question array.
            question.push(
                { type: 'input', name: 'firstName', message: 'What is the first name? ' },
                { type: 'input', name: 'lastName', message: 'What is the last name? ' },
                { type: 'list', name: 'role', choices: roleList },
                { type: 'list', name: 'manager', choices: managerList }
            );
            break

        case 'update an employee role':

            // Get data for employees, roles, managers.
            const resultEmp = await query.seeEmployees();

            const resultRoles = await query.seeRoles();

            const updateMan = await query.seeManagers();

            // map to arrays that can be used as list questions
            const updateManList = updateMan.rows.map(el => el.manager);

            const employeeList = resultEmp.rows.map(el => el.first_name + " " + el.last_name);

            const rolesList = resultRoles.rows.map(el => el.title);

            // Add update employee questions to question array.
            question.push(
                // Will be updated to list of employees
                { type: 'list', name: 'employee', choices: employeeList },
                // Will be updated to list of roles
                { type: 'list', name: 'roles', choices: rolesList },
                { type: 'list', name: 'manager', choices: updateManList }
            );
            break

        default:
    }
    // Variable to store 2nd stage questions.
    const answer2 = await inquirer.prompt(question);

    switch (answer.menu) {
        case 'add a department':
            const insertDep = async () => {
                // Pass data to update data
                await query.addDepartment(answer2.department);
                const output = await query.seeDepartments();
                // Show updated table.
                console.table(output.rows)
            }

            await insertDep();
            break

        case 'add a role':
            const insertRole = async () => {
                await query.addRole(answer2);
                const output = await query.seeRoles();
                console.table(output.rows)
            }
            await insertRole();
            break

        case 'add an employee':
            const insertEmployee = async () => {
                await query.addEmployee(answer2);
                const output = await query.seeEmployees();
                console.table(output.rows)
            }
            await insertEmployee();
            break

        case 'update an employee role':
            const updateRole = async () => {
                await query.changeRole(answer2);
                const output = await query.seeEmployees();
                console.table(output.rows);
            }
            await updateRole();
            break
    }
    // Recursively call the program so that it loops until user quits via CLI.
    runInq();
};

// Will need to utilise recursion to get the function to call itself.
runInq()

