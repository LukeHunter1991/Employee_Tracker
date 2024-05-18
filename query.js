const { Pool } = require('pg');

const pool = new Pool(
    {
        user: process.env.USER,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        database: process.env.DATABASE
    },
)

function Query() { }

Query.prototype.seeDepartments = () => {
    // Get all data from department table
    const output = pool.query("SELECT * FROM department");
    return output
}

Query.prototype.seeRoles = () => {
    // Get data from role and department tables.
    const output = pool.query("SELECT r.id, r.title, r.salary, d.name AS department FROM role r JOIN department d ON r.department_id = d.id");
    return output
}

Query.prototype.seeEmployees = () => {
    // Return all employee data.
    const output = pool.query(`SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department,
    employee.first_name||' '||employee.last_name AS manager 
    FROM employee e LEFT JOIN employee ON e.manager_id=employee.id 
    JOIN role r ON e.role_id = r.id 
    JOIN department d ON r.department_id = d.id`);
    return output
}


Query.prototype.seeManagers = async () => {
    // Return manager data from employee table.
    const output = pool.query(`SELECT DISTINCT employee.first_name||' '||employee.last_name AS manager FROM employee e LEFT JOIN employee ON e.manager_id=employee.id`);
    return output
}

Query.prototype.addDepartment = (departmentName) => {
    // Adds new department into department table.
    pool.query(`INSERT INTO department (name) VALUES ($1)`, [departmentName], (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Department Added!');
    });
}

Query.prototype.addRole = async (inputData) => {
    // Destructer object into variables.
    const { role, salary, departments } = inputData;

    // Query to get department id variable.
    let depId = await pool.query('SELECT department.id FROM department WHERE department.name = $1', [departments]);

    // Add role data to table.
    pool.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`, [role, salary, depId.rows[0].id], (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Role Added!');
    });


}

Query.prototype.addEmployee = async (inputData) => {

    // Destructure data into variables.
    const { firstName, lastName, role, manager } = inputData;

    // Query to get id from role table.
    let roleId = await pool.query('SELECT r.id FROM role r WHERE r.title = $1', [role]);

    // Split manager name into an array with first name and last name so they can be added to table. 
    managerName = manager.split(" ");

    // Query to get manager id from employee table.
    let managerId = await pool.query('SELECT e.id FROM employee e WHERE e.first_name =$1 AND e.last_name =$2', [managerName[0], managerName[1]]);

    // Add employee details into table.
    pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [firstName, lastName, roleId.rows[0].id, managerId.rows[0].id], (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Employee Added!');
    });


}

Query.prototype.changeRole = async (inputData) => {
    // Destructure data into variables.
    const { employee, roles, manager } = inputData;

    // Split manager name into an array with first name and last name so they can be added to table.    
    managerName = manager.split(" ");

    // Query to get manager id from employee table.
    let managerId = await pool.query('SELECT e.id FROM employee e WHERE e.first_name =$1 AND e.last_name =$2', [managerName[0], managerName[1]]);

    // Query to get id from role table.
    let roleId = await pool.query('SELECT r.id FROM role r WHERE r.title =$1', [roles]);
    // Split employee name into an array with first name and last name so they can be added to table.  
    employeeName = employee.split(" ");

    // Update role_id and manager_id columns in employee table for relevant employee.
    pool.query(`UPDATE employee SET role_id=$1, manager_id=$2 WHERE first_name=$3 AND last_name=$4`, [roleId.rows[0].id, managerId.rows[0].id, employeeName[0], employeeName[1]], (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Employee Details Updated!');
    });


}

module.exports = Query