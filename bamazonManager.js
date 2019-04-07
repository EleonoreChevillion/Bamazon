let mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});
begin();
function begin() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          var query = "SELECT * FROM products";
          connection.query(query, function(err, res) {
            console.log(res);
            restart();
          });
          break;

        case "View Low Inventory":
          lowInvent();
          break;

        case "Add to Inventory":
          addInvent();
          break;

        case "Add New Product":
          newProd();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

function lowInvent() {
  connection.query(
    "SELECT * FROM products WHERE stock_quantity <= '5'",
    function(err, res) {
      console.log(res);
    },
    restart()
  );
}

function addInvent() {
  inquirer
    .prompt([
      {
        name: "prod",
        type: "input",
        message: "Which product do you want to add stock to? (Please type ID)"
      },
      {
        name: "addStock",
        type: "input",
        message: "How many products do you want to add?"
      }
    ])
    .then(function(answer) {
      var choice = answer.prod;
      var moreStock = answer.addStock;

      connection.query(
        "SELECT stock_quantity FROM products WHERE ?",
        { ID: choice },
        function(err, res) {
          var addedStock = moreStock + res[0].stock_quantity;

          connection.query(
            `UPDATE products SET stock_quantity = ${addedStock} WHERE ?`,

            {
              ID: choice
            },
            (err, res) => {
              if (err) throw err;
            }
          );
        },
        restart()
      );
    });
}

function newProd() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What's the name of your product?",
        name: "name"
      },
      {
        type: "input",
        message: "What's the department of your product?",
        name: "department"
      },
      {
        type: "input",
        message: "What's the price of your product?",
        name: "price"
      },
      {
        type: "input",
        message: "How much inventory do you have?",
        name: "inventory"
      }
    ])
    .then(function(response) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: response.name,
          department_name: response.department,
          price: response.price,
          stock_quantity: response.inventory,
          product_sales: 0
        },
        (err, res) => {
          if (err) throw err;
          console.log(response.name + " was inserted into row " + res.insertId);
        },
        restart()
      );
    });
}

function restart() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Would you like to go back to the main menu?",
      choices: ["Yes", "No"]
    })
    .then(function(answer) {
      if (answer.action === "Yes") {
        begin();
      } else if (answer.action === "No") {
        connection.end();
      }
    });
}
