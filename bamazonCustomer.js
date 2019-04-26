var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    makeTable();
});

var makeTable = function () {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // console.log(results);
        for (var i = 0; i < results.length; i++) {
            console.log(results[i].item_id + " || " + results[i].product_name + " || " +
                results[i].department_name + " || " + results[i].price + " || " + results[i].stock_quantity + "\n");
        };
        promptCustomer(results);
    });
};

var promptCustomer = function (res) {
    console.log(promptCustomer);
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: "What would you like to buy? [Leave with Q]"
    }]).then(function (answer) {
        var correct = false;
        // if(answer.choice.toUpperCase() == "Q"){
        //     process.exit();
        // }
        for (var i = 0; i < res.length; i++) {
            if (res[i].product_name == answer.choice) {
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: "input",
                    name: "quant",
                    message: "How many would you like to buy?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function (answer) {
                    if ((res[id].stock_quantity - answer.quant) > 0) {
                        connection.query("UPDATE products SET stock_quantity=''" + (res[id].stock_quantity -
                            answer.quant) + " 'WHERE productname= '" + product + " ' ", function (err, res2) {
                            console.log("Product Bought!");
                            makeTable();
                        });
                    } else {
                        console.log("Not a valid selection :(");
                        promptCustomer(res);
                    };
                });
            };
        };
        if (i === res.length && correct === false) {
            console.log("Not a valid selection :(");
            promptCustomer(res);
        };
    });
};