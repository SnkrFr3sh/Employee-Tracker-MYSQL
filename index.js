const db = require("./db");
const logo = require("asciiart-logo");
const { prompt } = require("inquirer");
require("console.table");

init();

function init() {
    const menuLogo = logo({
        name: "Employee-Manager",
        borderColor: "bold-blue",
        logoColor: "bold-green"
    }).render();

    console.log(menuLogo);

    menuOptions();
}

function mainMenu() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee's Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View All Employees",
                    value: "ALL_EMPLOYEES"
                },
                {
                    name: "View All Employees By Department",
                    value: "SORT_ALL_BY_DEPARTMENT"
                },
                {
                    name: "View All Employees By Manager",
                    value: "SORT_ALL_BY_MANAGER"
                },
                {
                    name: "Exit",
                    value: "EXIT"
                }
            ]
        }
    ]).then(res => {
        let options = res.options;
        switch (options) {
            case "ADD_EMPLOYEE":
                createEmployee();
                break;
            case "ADD_DEPARTMENT":
                createDepartment();
                break;
            case "ADD_ROLE":
                createRole();
                break;
            case "REMOVE_DEPARTMENT":
                deleteDepartment();
                break;
            case "REMOVE_EMPLOYEE":
                deleteEmployee();
                break;
            case "REMOVE_ROLE":
                deleteRole();
                break;
            case "VIEW_BY_DEPARTMENT":
                viewByDepartment();
                break;
            case "VIEW_BY_MANAGER":
                viewByManager();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "UPDATE_EMPLOYEE_MANAGER":
                updateEmployeeManager();
                break;
            case "ALL_EMPLOYEES":
                viewEmployees();
                break;
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "VIEW_All_ROLES":
                viewRoles();
                break;
            default:
                quit();
        }
    }
    )
};




// DEPARTMENT FUNCTIONS
//  View
function viewDepartments() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            // console.log("\n");
            console.table(departments);
        })
        .then(() => mainMenu());
}

// View sorted by department
function viewByDepartment() {
    db.findAllDepartments()
      .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
          name: name,
          value: id
        }));
  
        prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Which department do you want to view?",
            choices: departmentChoices
          }
        ])
          .then(res => db.viewByDepartment(res.departmentId))
          .then(([rows]) => {
            let employees = rows;
            // console.log("\n");
            console.table(employees);
          })
          .then(() => mainMenu())
      });
  }

// ADD
function createDepartment() {
    prompt([
        {
            name: "name",
            message: "What is the department name?"
        }
    ])
        .then(res => {
            let dname = res;
            db.createDepartment(dname)
                .then(() => console.log(`${dname.name} has been added.`))
                .then(() => mainMenu())
        })
}

// DELETE
function deleteDepartment() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt({
                type: "list",
                name: "departmentId",
                message:
                    "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
                choices: departmentChoices
            })
                .then(res => db.deleteDepartment(res.departmentId))
                .then(() => console.log(`Removed department from the database`))
                .then(() => mainMenu())
        })
}

// ROLE FUNCTIONS
// View
function viewRoles() {
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            // console.log("\n");
            console.table(roles);
        })
        .then(() => mainMenu());
}

// Add
function createRole() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    name: "title",
                    message: "Enter role name."
                },
                {
                    name: "salary",
                    message: "Enter salary of role."
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department does the role belong to?",
                    choices: departmentChoices
                }
            ])
                .then(role => {
                    db.createRole(role)
                        .then(() => console.log(`Added ${role.title} to the database`))
                        .then(() => mainMenu())
                })
        })
}

// Delete
function deleteRole() {
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "roleId",
                    message:
                        "Which role do you want to delete?",
                    choices: roleChoices
                }
            ])
                .then(res => db.deleteRole(res.roleId))
                .then(() => console.log("Removed role from the database"))
                .then(() => mainMenu())
        })
}

// EMPLOYEE FUNCTION
// View all employees
function viewEmployees() {
    db.findAllEmployees()
      .then(([rows]) => {
        let employees = rows;
        // console.log("\n");
        console.table(employees);
      })
      .then(() => mainMenu());
  }



// ADD
function createEmployee() {
    prompt([
        {
            name: "first_name",
            message: "Enter first name of new employee."
        },
        {
            name: "last_name",
            message: "Enter last name of new employee."
        }
    ])
        .then(res => {
            let firstName = res.first_name;
            let lastName = res.last_name;

            db.findRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));

                    prompt({
                        type: "list",
                        name: "roleId",
                        message: "Enter employee's role.",
                        choices: roleChoices
                    })
                        .then(res => {
                            let roleId = res.roleId;

                            db.findEmployees()
                                .then(([rows]) => {
                                    let employees = rows;
                                    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                                        name: `${first_name} ${last_name}`,
                                        value: id
                                    }));

                                    managerChoices.unshift({ name: "None", value: null });

                                    prompt({
                                        type: "list",
                                        name: "managerId",
                                        message: "Enter employee's manager.",
                                        choices: managerChoices
                                    })
                                        .then(res => {
                                            let employee = {
                                                manager_id: res.managerId,
                                                role_id: roleId,
                                                first_name: firstName,
                                                last_name: lastName
                                            }

                                            db.createEmployee(employee);
                                        })
                                        .then(() => console.log(
                                            `Added ${firstName} ${lastName} to the database`
                                        ))
                                        .then(() => mainMenu())
                                })
                        })
                })
        })
}

//   DELETE 
function deleteEmployee() {
    db.findAll()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee do you want to remove?",
                    choices: employeeChoices
                }
            ])
                .then(res => db.removeEmployee(res.employeeId))
                .then(() => console.log("Removed employee from the database"))
                .then(() => mainMenu())
        })
}

// UPDATE: role
function updateEmployeeRole() {
    db.findAll()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee do you want to update?",
                    choices: employeeChoices
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId;
                    db.findAllRoles()
                        .then(([rows]) => {
                            let roles = rows;
                            const roleChoices = roles.map(({ id, title }) => ({
                                name: title,
                                value: id
                            }));

                            prompt([
                                {
                                    type: "list",
                                    name: "roleId",
                                    message: "What is the employee's new role?",
                                    choices: roleChoices
                                }
                            ])
                                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                                .then(() => console.log("Employee role updated"))
                                .then(() => mainMenu())
                        });
                });
        })
}

// UPDATE: manager
function updateEmployeeManager() {
    db.findAll()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee do you want to update?",
                    choices: employeeChoices
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId
                    db.findAllPossibleManagers(employeeId)
                        .then(([rows]) => {
                            let managers = rows;
                            const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }));

                            prompt([
                                {
                                    type: "list",
                                    name: "managerId",
                                    message:
                                        "Who is the employee's new manager?",
                                    choices: managerChoices
                                }
                            ])
                                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                                .then(() => console.log("Employee's Manager Updated."))
                                .then(() => mainMenu())
                        })
                })
        })
}

// MANAGER FUNCTION
function viewByManager() {
    db.findAllEmployees()
      .then(([rows]) => {
        let managers = rows;
        const managerChoices = managers.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id
        }));
  
        prompt([
          {
            type: "list",
            name: "managerId",
            message: "Which employee do you want to see direct reports for?",
            choices: managerChoices
          }
        ])
          .then(res => db.findAllEmployeesByManager(res.managerId))
          .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            if (employees.length === 0) {
              console.log("The selected employee has no direct reports");
            } else {
              console.table(employees);
            }
          })
          .then(() => loadMainPrompts())
      });
  }



function quit() {
    console.log("Goodbye");
    process.exit();
  }


