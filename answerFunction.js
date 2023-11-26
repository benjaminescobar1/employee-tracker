require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');

// create connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
});

// connect to the database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Connected to the database');
});

// view all departments
const viewAllDepartments = function() {
    connection.query('SELECT id, name FROM department', (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
  
      console.table(results, ['id', 'name']);
    });
};

// view all roles
const viewAllRoles = function() {
    connection.query('SELECT role.title, role.salary, department.name AS department_name FROM role JOIN department ON role.department_id = department.id', (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
  
      console.table(results, ['title', 'salary', 'department_name']);
    });
};

// view all employees
const viewAllEmployees = function() {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_name FROM employee JOIN role ON employee.role_id = role.id', (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
    
        console.table(results, ['id', 'first_name', 'last_name', 'role_name']);
      });
  };

// add a department
const addDepartment = function() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'deptName',
        message: "Enter a name for the department:",
      }
    ])
    .then((answers) => {
      const departmentName = answers.deptName;
      insertDepartment(departmentName);
    })
    .catch((error) => {
      console.error(error);
    });
};

// add a role
const addRole = function() {
    connection.query('SELECT name FROM department', (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
  
      const departmentList = results.map((result) => ({
        name: result.name,
        value: result.id
      }));

      inquirer.prompt([
        {
          type: 'input',
          name: 'roleName',
          message: "Enter a name for the role:",
        },
        {
          type: 'input',
          name: 'roleSalary',
          message: "Enter the salary for the role:",
        },
        {
          type: 'list',
          name: 'roleDept',
          message: "Which department does this role belong to?",
          choices: departmentList,
        }
      ])
      // map the results
      .then((answers) => {
        const roleName = answers.roleName;
        const roleSalary = answers.roleSalary;
        const roleDept = answers.roleDept;
        insertRole(roleName, roleSalary, roleDept);
      })
      .catch((error) => {
        console.error(error);
      });
    });
};

// add an employee
const addEmployee = function() {
    connection.query('SELECT DISTINCT manager_id FROM employee', (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
  
      const managerList = results.map((result) => ({
        value: result.manager_id
      }));
  
      connection.query('SELECT id, title FROM role', (error, roleResults) => {
        if (error) {
          console.error(error);
          return;
        }
  
        const roleList = roleResults.map((role) => ({
          name: role.title,
          value: role.id
        }));
  
        inquirer.prompt([
          {
            type: 'input',
            name: 'employeeFirst',
            message: "Enter the first name of the employee:"
          },
          {
            type: 'input',
            name: 'employeeLast',
            message: "Enter the last name of the employee:"
          },
          {
            type: 'list',
            name: 'employeeRole',
            message: "Choose the role of the employee:",
            choices: roleList
          },
          {
            type: 'list',
            name: 'employeeManager',
            message: "Who is the manager for this employee?",
            choices: managerList
          }
        ])
        // map the results
        .then((answers) => {
          const employeeFirst = answers.employeeFirst;
          const employeeLast = answers.employeeLast;
          const employeeRole = answers.employeeRole;
          const employeeManager = answers.employeeManager;
          insertEmployee(employeeFirst, employeeLast, employeeRole, employeeManager);
        })
        .catch((error) => {
          console.error(error);
        });
      });
    });
  };

const updateEmployeeRole = function() {
    console.log("Test");
};

// insert department
const insertDepartment = function(departmentName) {

    connection.query('INSERT INTO department (name) VALUES (?)', [departmentName], (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log("Department inserted successfully");
    });
};

// insert role
const insertRole = function(roleName, roleSalary, roleDept) {
    connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [roleName, roleSalary, roleDept], (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log("Role inserted successfully!");
    });
  };

// insert employee
const insertEmployee = function(employeeFirst, employeeLast, employeeRole, employeeManager) {
    connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [employeeFirst, employeeLast, employeeRole, employeeManager], (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log("Employee added successfully");
      });
    };

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};