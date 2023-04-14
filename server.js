const inquirer = require('inquirer');
const connect = require('./connection');

AskQuestion();

function AskQuestion(){
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

  .then(function(answer){
    switch (answer.prompt){
        case 'Show all departments':
            viewAllDep();
            break;
    }
  })

      
};

const viewAllDep = () => {
    db.query("SELECT * FROM department", (err, res) => {
      if (err) throw err;
      console.table(res);
      Question();
    });
  };
  

    

    
