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
start();
// afficher ce qu'il y a dans ma database
function start() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    console.log(res);
    questions();
  });
}

function questions() {
  inquirer
    .prompt([
      {
        name: "choice",
        type: "input",
        message: "Please give the ID of the product you want"
      },
      {
        name: "quantity",
        type: "input",
        message: "Which quantity would you like?"
      }
    ])
    .then(function(answer) {
      var product = answer.choice;
      var quantity = answer.quantity;
      //   console.log(product);
      //   console.log(quantity);

      connection.query(
        "SELECT stock_quantity, price, product_sales FROM products WHERE ?",
        { ID: product },
        function(err, res) {
          var new_stock = res[0].stock_quantity - quantity;
          console.log(new_stock);
          if (new_stock <= 0) {
            console.log("Product out of stock");
            restart();
          } else {
            var price = quantity * res[0].price;
            var sales = price + res[0].product_sales;
            console.log("Your total price is: $" + price);
            connection.query(
              `UPDATE products SET product_sales = ${sales} WHERE ?`,
              {
                ID: product
              },
              (err, res) => {
                if (err) throw err;
              }
            );
            connection.query(
              `UPDATE products SET stock_quantity = ${new_stock} WHERE ?`,

              {
                ID: product
              },
              (err, res) => {
                if (err) throw err;
              }
            );
            restart();
          }
        }
      );
    });
}
function restart() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Would you like to buy more products?",
      choices: ["Yes", "No"]
    })
    .then(function(answer) {
      if (answer.action === "Yes") {
        start();
      } else if (answer.action === "No") {
        connection.end();
      }
    });
}
