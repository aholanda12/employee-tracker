var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Anderson[1256",
  database: "employee_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "MAIN MENU",
      choices: [
          "View all employees", 
          "View all roles", 
          "View all departments", 
          "Add employee", 
          "Add role", 
          "Add department", 
          "Update an employee role",
          "EXIT"]
    })
    .then(function(answer) {
      if (answer.action === "View all employees") {
        viewEmployees();
      }
      else if(answer.action === "View all roles") {
        viewRoles();
      } 
      else if(answer.action === "View all departments") {
        viewDepartments();
      } 
      else if(answer.action === "Add employee") {
        addEmployee();
      } 
      else if(answer.action === "Add role") {
        addRole();
      } 
      else if(answer.action === "Add department") {
        addDepartment();
      } 
      else if(answer.action === "Update an employee role") {
        updateEmployee();
      } 
      else{
        connection.end();
      }
    });
}

function returnMainMenu() {
    inquirer
      .prompt({
        name: "return",
        type: "list",
        message: "Return to main menu?",
        choices: [
            "RETURN", 
            "EXIT"]
      })
      .then(function(answer) {
        if (answer.return === "RETURN") {
          mainMenu();
        }
        else{
          connection.end();
        }
      });
  }

function viewEmployees() {
    const query = "SELECT * from employee"
    
    connectionQuery(query)
    .then(res => {
        console.log("/n");
        console.table(res);
        returnMainMenu()

    })
}

function viewRoles() {
    const query = "SELECT * from role"
    
    connectionQuery(query)
    .then(res => {
        console.log("/n");
        console.table(res);
        returnMainMenu()

    })
}

function viewDepartments() {
    const query = "SELECT * from department"
    
    connectionQuery(query)
    .then(res => {
        console.log("/n");
        console.table(res);
        returnMainMenu()

    })
}

// function to handle posting new items up for auction
function postAuction() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?"
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place your auction in?"
      },
      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}
