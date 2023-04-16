const inquirer = require('inquirer');
const connect = require('./connection');

AskQuestion();
//run prompt question
function AskQuestion() {
  inquirer.prompt([
    {
      name: "prompt",
      type: "list",
      message: "EMPLOYEE MANAGER\n What would you like to do?",
      choices: [
        "Show all departments",
        "Add a department",
        "Remove a department",
        "Show all roles",
        "Add a role",
        "Remove a role",
        "Show all employees",
        "Add an employee",
        "Remove an employee",
        "Update an employee role",
        "I am done",
      ],
    },
  ])
    .then(function (answer) {
      switch (answer.prompt) {
        case 'Show all departments':
          viewAllDep();
          break;
        case 'Add a department':
          addDepartment()
          break;
        case 'Remove a department':
          removeDepartment()
          break;
        case 'Show all roles':
          showAllRoles()
          break;
        case 'Add a role':
          addARole()
          break;
        case 'Remove a role':
          removeARole()
          break;
        case 'Show all employees':
          showAllEmployees()
          break;
        case 'Add an employee':
          addAnEmployee()
          break;
        case 'Remove an employee':
          removeEmployee()
          break;
        case 'Update an employee role':
          updateEmployeeRole()
          break;
        default:
          return done();

      }

    })
};
// view all department
function viewAllDep() {
  connect.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    AskQuestion();
  });
};
// Adding department
function addDepartment() {
  inquirer.prompt([
    {
      type: "input",
      message: 'What is the name of Department?',
      name: 'name'
    }
  ])
    .then((response) => {
      let sqlQuery = 'INSERT INTO department SET ?';
      connect.query(sqlQuery, response, function (error, results) {
        if (error) throw error;
        console.log('New department has been successfully created!');
        AskQuestion();
      });
    })
};
// Remove any department as user wants
function removeDepartment() {
  connect.query('SELECT * FROM department', function (error, results) {
    let departments = [];
    if (error) throw error;
    departments = results.map(result => ({
      id: result.id,
      name: result.name,
    }));
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'id',
          message: 'Which department would you like to remove?',
          choices: departments.map(dep => ({
            name: dep.name,
            value: dep.id,
          })),
        },
      ])
      .then(response => {
        let sqlQuery = 'DELETE FROM department where id = ?';
        let depId = response.id;
        connect.query(sqlQuery, depId, function (error, results) {
          if (error) throw error;
          console.log('Department has been destroyed!');
          AskQuestion()
        });
      });
  });
};

// show all roles 
function showAllRoles() {
  connect.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    AskQuestion();
  });
};

function addARole() {
  let sqlQuery = 'SELECT * FROM department';
  connect.query(sqlQuery, function (error, results) {
    let departments = [];
    if (error) throw error;
    departments = results.map(result => ({
      id: result.id,
      name: result.name,
    }));
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Please, add a role title',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Please, add a salary for this role',
        },
        {
          type: 'list',
          name: 'id',
          message: 'Which department this role belongs to?',
          choices: departments.map(dep => ({
            name: dep.name,
            value: dep.id,
          })),
        },
      ])
      .then(response => {
        let sqlQuery = 'INSERT INTO role SET ?';
        let newRole = {
          title: response.title,
          salary: response.salary,
          department_id: response.id,
        };
        connect.query(sqlQuery, newRole, function (error, results) {
          if (error) throw error;
          console.log('Role has been added');
          AskQuestion();
        });
      });
  });
};
// remove any role as user wants
function removeARole() {
  connect.query('SELECT * FROM role', function (error, results) {
    let roles = [];
    if (error) throw error;
    roles = results.map(result => ({
      id: result.id,
      title: result.title,
    }));
    roles.unshift({
      title: "none",
      value: null,
    });
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'id',
          message: 'Which role would you like to remove?',
          choices: roles.map(role => ({
            name: role.title,
            value: role.id,
          })),
        },
      ])
      .then(response => {
        let sqlQuery = 'DELETE FROM role where id = ?';
        let roleId = response.id;
        connect.query(sqlQuery, roleId, function (error, results) {
          if (error) throw error;
          console.log('Department has been destroyed!');
          AskQuestion()
        });
      });
  });
};

// Show all employees
function showAllEmployees() {
  let sqlQuery = `SELECT employee.id, employee.first_name, employee.last_name,
       CONCAT (employee.first_name,' ', employee.last_name)
       as NAME, role.title as ROLE, 
       department.name as DEPARTMENT, 
       CONCAT (manager.first_name, ' ', manager.last_name) 
       AS MANAGER FROM employee 
       LEFT JOIN role on employee.role_id = role.id 
       LEFT JOIN department on role.department_id = department.id 
       LEFT JOIN employee manager on employee.manager_id = manager.id`;
  connect.query(sqlQuery, function (error, results) {
    if (error) throw error;
    console.table(results, ['NAME', 'ROLE', 'DEPARTMENT', 'MANAGER']);
    AskQuestion();
  })
};

// Add an employee
function addAnEmployee() {
  const sqlQuery = 'INSERT INTO employee SET ?';
  const roleQuery = 'SELECT * FROM role';
  connect.query(roleQuery, function (error, results) {
    let roles = [];
    if (error) throw error;
    roles = results.map(result => ({
      id: result.id,
      title: result.title,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?",
        },
        {
          type: "input",
          name: "role_id",
          message: "What is the employee's role ID?",
        },
      ])
      .then((response) => {
        connect.query("INSERT INTO employee SET ?", response, (err, results) => {
          if (err) throw err;
          console.log("Employee added successfully.");
          AskQuestion()
        });
      });
  });
};

// Remove an employee
function removeEmployee() {
  const sqlQuery = 'SELECT id, first_name, last_name FROM employee';
  connect.query(sqlQuery, function (error, results) {
    if (error) throw error;
    const employees = results.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    employees.unshift({
      name: 'None',
      value: null,
    });
    inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Which employee would you like to remove?',
        choices: employees
      }
    ])

      .then(response => {
        console.log(response);
        let sqlQuery = 'DELETE FROM employee where id = ?';
        let depId = response.id;
        connect.query(sqlQuery, depId, function (error, results) {
          if (error) throw error;
          console.log('Employee has been destroyed!');
          AskQuestion()
        });
      });
  });
};

// Update Employee
function updateEmployeeRole() {
  const sqlQuery = 'SELECT id, first_name, last_name, role_id FROM employee';
  connect.query(sqlQuery, function (error, results) {
    if (error) throw error;
    const employees = results.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    employees.unshift({
      name: 'None',
      value: null,
    });
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'id',
          message: "Which employee's role do you want to update?",
          choices: employees,
        },
      ])
      .then(({ id }) => {
        const roleQuery = 'SELECT * FROM role';
        connect.query(roleQuery, function (error, results) {
          if (error) throw error;
          console.log(results);
          const roles = results.map(result => ({
            name: result.title,
            value: result.id,
          }));

          inquirer
            .prompt([
              {
                type: 'list',
                name: 'role_id',
                message: 'Which is the new role for this employee employee?',
                choices: roles,
              },
            ])
            .then(({ role_id }) => {
              const updateQuery = `UPDATE employee SET ? WHERE id = ${id}`;
              connect.query(updateQuery, { role_id }, function (error, results) {
                if (error) throw error;
                console.log("Updated employee's role");
                AskQuestion()
              });
            });
        });
      });
  });
};

// Time to go
function done() {
  console.log("I hope you enjoyed from my coding");
  process.exit();
}