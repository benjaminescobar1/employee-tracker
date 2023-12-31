const connection = require("../config/connection");
const inquirer = require("inquirer");

// View all departments
async function viewAllDepartments() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("\n");
    console.table(results);
  });
}

// View all roles
async function viewAllRoles() {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("\n");
    console.table(results);
  });
}

// View all employees
async function viewAllEmployees() {
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("\n");
    console.table(results);
  });
}

// Add a department
async function addDepartment() {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department you would like to add?",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answers.department,
        },
        function (err, results) {
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.table(results);
        }
      );
    });
}

// Add a role
async function addRole() {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the role you would like to add?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role you would like to add?",
      },
      {
        type: "input",
        name: "department_id",
        message: "What is the department ID of the role you would like to add?",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answers.title,
          salary: answers.salary,
          department_id: answers.department_id,
        },
        function (err, results) {
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.table(results);
        }
      );
    });
}

// Add an employee
async function addEmployee() {
  await inquirer

    .prompt([
      {
        type: "input",
        name: "first_name",
        message:
          "What is the first name of the employee you would like to add?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the last name of the employee you would like to add?",
      },
      {
        type: "input",
        name: "role_id",
        message: "What is the role ID of the employee you would like to add?",
      },
      {
        type: "input",
        name: "manager_id",
        message:
          "What is the manager ID of the employee you would like to add?",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answers.first_name,
          last_name: answers.last_name,
          role_id: answers.role_id,
          manager_id: answers.manager_id,
        },
        function (err, results) {
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.table(results);
        }
      );
    });
}

// Update an employee role
async function updateEmployeeRole() {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "employee_id",
        message: "What is the ID of the employee you would like to update?",
      },
      {
        type: "input",
        name: "role_id",
        message:
          "What is the new role ID of the employee you would like to update?",
      },
    ])
    .then((answers) => {
      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: answers.role_id,
          },
          {
            id: answers.employee_id,
          },
        ],
        function (err, results) {
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.table(results);
        }
      );
    });
}

// update employee managers
async function updateEmployeeManager() {
  await inquirer

    .prompt([
      {
        type: "input",
        name: "employee_id",
        message: "What is the ID of the employee you would like to update?",
      },
      {
        type: "input",
        name: "manager_id",
        message:
          "What is the new manager ID of the employee you would like to update?",
      },
    ])
    .then((answers) => {
      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
          {
            manager_id: answers.manager_id,
          },
          {
            id: answers.employee_id,
          },
        ],
        function (err, results) {
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.table(results);
        }
      );
    });
}

//  view employees by manager
async function viewEmployeesByManager() {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "manager_id",
        message: "What is the ID of the manager you would like to view?",
      },
    ])
    .then((answers) => {
      connection.query(
        "SELECT * FROM employee WHERE ?",
        {
          manager_id: answers.manager_id,
        },
        function (err, results) {
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.table(results);
        }
      );
    });
}

// view employees by department
async function viewEmployeesByDepartment() {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "department_id",
        message: "What is the ID of the department you would like to view?",
      },
    ])
    // Get roles for the department and then get employees for those roles
    .then((answers) => {
      connection.query(
        "SELECT * FROM role WHERE ?",
        {
          department_id: answers.department_id,
        },
        function (err, results) {
          if (err) {
            console.log(err);
          }
          // Get employees for the roles
          connection.query(
            "SELECT * FROM employee WHERE ?",
            {
              role_id: results[0].id,
            },
            function (err, results) {
              if (err) {
                console.log(err);
              }
              console.log("\n");
              console.table(results);
            }
          );
        }
      );
    });
}

// view the total budget of a department
async function viewDepartmentBudget() {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "department_id",
        message: "What is the ID of the department you would like to view?",
        validator: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then((answers) => {
      connection.query(
        "SELECT * FROM role WHERE ?",
        {
          department_id: answers.department_id,
        },
        function (err, results) {
          if (err) {
            console.log(err);
          }
          console.log("\n");
          console.table(results);

          // total the salaries
          let totalSalaries = 0;
          for (let i = 0; i < results.length; i++) {
            totalSalaries += parseInt(results[i].salary);
          }
          console.log("Total Salaries: " + totalSalaries);
        }
      );
    });
}


// Export the functions
module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  viewDepartmentBudget,  
};