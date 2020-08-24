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
            inquirer.prompt([{
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
                            inquirer.prompt([
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
                                        connection.query(query, values, function (err) {
                                            if (err) throw err;
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
            inquirer.prompt([
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
                        connection.query(insert, values, function (err) {
                            if (err) throw err;
                            console.log(`You have added this role: ${(values[0]).toUpperCase()}.`)
                            })
                        viewRoles();
                    })
            })
        }

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "dept",
            message: "What is the new department called?",
        }
    ]).then(function(answer) {
        const department = answer.dept;
        connection.query("INSERT INTO department (name) VALUES (?)", department, function (err) {
            if (err) throw err;
            console.log(`You have added this role: ${(department[0]).toUpperCase()}.`)
            })
        viewDepartments();
    })
}

function updateEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
    inquirer.prompt([
        {
            name: "employee",
            type: "list",
            message: "Who would you like to update?",
            choices: function () {
                employeeArray = []
                res.forEach(res => {
                    employeeArray.push(res.last_name);
                })
                return employeeArray;
            }
        }
    ]).then(function(answer) {
        const employee = answer.employee;
        let filteredEmp = res.filter(function (res) {
            return res.last_name == employee;
        })
        connection.query("SELECT * FROM role", function (err, res) {
        inquirer.prompt([
        {
            name: "roleName",
            type: "list",
            message: "What role are they being updated to?",
            choices: function () {
                rolesArray = [];
                res.forEach(result => {
                    rolesArray.push(result.title);
                })
                return rolesArray;
            }
        }
    ]).then(function(roleAnswer) {
        const role = roleAnswer.roleName;
        let filteredRole = res.filter(function (res) {
            return res.title == role;
        })
        connection.query("SELECT * FROM employee", function (err, res) {
            inquirer.prompt([
            {
                name: "manager",
                type: "list",
                message: "Who is their new manager?",
                choices: function () {
                    managersArray = []
                    res.forEach(res => {
                        managersArray.push(res.last_name);
                    })
                    managersArray.push("None")
                    return managersArray;
                }
            }
        ]).then(function(managerAnswer) {
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

               const empId = filteredEmp[0].id;
               const roleId = filteredRole[0].id;


        connection.query("UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?", [roleId, managerId, empId], function (err) {
            if (err) throw err;
            console.log(`You have updated this employee: ${(employee).toUpperCase()}.`)
            })
        viewEmployees();
    })
})
})
})
})
})
})
}