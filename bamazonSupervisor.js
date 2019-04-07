let mysql = require("mysql");

connection.query(
  "INSERT INTO departments SET ?",
  {
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

// 1. select unique department_names from products_table => list of departments
// 2. for departmentName in departments
//      => select sum(product_sales) from products where department === department_name
//      => total product sales for each department
//      => insert name, id, product_sales, overhead, profit ... into departments table
