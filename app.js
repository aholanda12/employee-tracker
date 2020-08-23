const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const util = require("util")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Anderson[1256",
    database: "employees_DB"
});

const connectionQuery = util.promisify(connection.query.bind(connection));

connection.connect(function (err) {
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
        .then(function (answer) {
            if (answer.action === "View all employees") {
                viewEmployees();
            }
            else if (answer.action === "View all roles") {
                viewRoles();
            }
            else if (answer.action === "View all departments") {
                viewDepartments();
            }
            else if (answer.action === "Add employee") {
                addEmployee();
            }
            else if (answer.action === "Add role") {
                addRole();
            }
            else if (answer.action === "Add department") {
                addDepartment();
            }
            else if (answer.action === "Update an employee role") {
                updateEmployee();
            }
            else {
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
        .then(function (answer) {
            if (answer.return === "RETURN") {
                mainMenu();
            }
            else {
                connection.end();
            }
        });
}

function viewEmployees() {
    const query = "SELECT * from employee"

    connectionQuery(query)
        .then(res => {
            console.table(res);
            returnMainMenu()

        })
}

function viewRoles() {
    const query = "SELECT * from role"

    connectionQuery(query)
        .then(res => {
            console.table(res);
            returnMainMenu()

        })
}

function viewDepartments() {
    const query = "SELECT * from department"

    connectionQuery(query)
        .then(res => {
            console.table(res);
            returnMainMenu()

        })
}

function addEmployee() {

    const query = "SELECT * from role"
    connectionQuery(query)
        .then(res => {

            inquirer
                .prompt([{
                    name: "firstName",
                    type: "input",
                    message: "What is the employee's first name?",
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the employee's last name?",
                },
                {
                    name: "roleName",
                    type: "list",
                    message: "What role does the employee have?",
                    choices: function () {
                        rolesArray = [];
                        res.forEach(result => {
                            rolesArray.push(result.title);
                        })
                        return rolesArray;
                    }
                }
                ])
                .then(function (answer) {
                    const role = answer.roleName;
                    connection.query('SELECT * FROM role', function (err, res) {
                        if (err) throw (err);
                        let filteredRole = res.filter(function (res) {
                            return res.title == role;
                        })
                        let roleId = filteredRole[0].id;


                        connection.query("SELECT * FROM employee", function (err, res) {
                            inquirer
                                .prompt([
                                    {
                                        name: "manager",
                                        type: "list",
                                        message: "Who is your manager?",
                                        choices: function () {
                                            managersArray = []
                                            res.forEach(res => {
                                                managersArray.push(res.last_name);
                                            })
                                            managersArray.push("None")
                                            return managersArray;
                                        }
                                    }
                                ]).then(function (managerAnswer) {
                                    const manager = managerAnswer.manager;
                                    connection.query("SELECT * FROM employee", function (err, res) {
                                        if (err) throw (err);
                                        let filteredManager = res.filter(function (res) {
                                            return res.last_name == manager;
                                        })

                                        if (manager !== "None") {
                                            managerId = filteredManager[0].id;
                                            
                                        }
                                        else {
                                            managerId = null; 
                                        }

                                        let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                                        let values = [answer.firstName, answer.lastName, roleId, managerId]
                                        connection.query(query, values,
                                            function (err, res, fields) {
                                                console.log(`You have added this employee: ${(values[0]).toUpperCase()}.`)
                                            })
                                        viewEmployees();
                                    })

                                })
                        })
                    })
                })
        })
}

function addRole() {
    const query = "SELECT * from department"
    connectionQuery(query)
        .then(res => {
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "role",
                        message: "What is the new role called?",
                    },
                    {
                        type: "input",
                        name: "salary",
                        message: "How much money do they make?",
                    },
                    {
                        name: "department",
                        type: "list",
                        message: "What department is the role in?",
                        choices: function () {
                            deptArray = []
                            res.forEach(res => {
                                deptArray.push(res.name);
                            })
                            return deptArray;
                        }
                    }
                ]).then(function(answer) {
                        const department = answer.department;
                        let filteredDept = res.filter(function (res) {
                            return res.name == department;
                        })

                        var newRole = answer.role;
                        var newSalary = answer.salary;
                        var newDept = filteredDept[0].id;

                        let insert = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                        let values = [newRole, newSalary, newDept]
                        connection.query(insert, values,
                            function (err, res, fields) {
                                console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
                            })
                        viewRoles();
                    })
            })
        }




function bidAuction() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM auctions", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
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
            .then(function (answer) {
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
                        function (error) {
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
