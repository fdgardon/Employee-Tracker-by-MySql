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
        "Show all roles",
        "Add a role",
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




