const inquirer = require('inquirer');
const connect = require('./connection');

AskQuestion();

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
        case 'Update an employee role':
          updateEmployeeRole()
          break;

      }

    })
};

const viewAllDep = () => {
  connect.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    AskQuestion();
  });
};
const addDepartment = () => {
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

const removeDepartment = () => {
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


const showAllRoles = () => {
  connect.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    AskQuestion();
  });
};

const addARole = () => {
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

const removeARole = () => {
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




