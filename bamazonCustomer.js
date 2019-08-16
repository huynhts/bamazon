var mysql = require("mysql");
var inquirer = require ("inquirer");

var buyID = '';
var buyQuantity = 0;

var connection = mysql.createConnection({
    host: "localhost",

    //your port; if not 3306:
    port:3306,

    //your username:
    user: "nodeuser",

    //your password:
    password: "",
    database: "bamazon"

});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);



    connection.query('SELECT * FROM products', function(err, response){
        if(err) throw err;

        console.table(response);
        bamazonStart();
    });

    connection.end();

});

function bamazonStart () {
    inquirer
    .prompt({
      name: "userStart",
      type: "list",
      message: "Would you like to buy an item from Bamazon?? [YES] or [NO]",
      choices: ["YES", "NO"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.userStart === "YES") {
        buyItem();
      } else{
        connection.end();
      }
    });
};

function buyItem () {
    inquirer
    .prompt({
        name: "itemPurchase",
        type: "input",
        message: "Please enter the ID of the item you would like to purchase.",
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
        buyID = answer.itemPurchase;
    
        purchaseQuantity();
    });
    
};

function purchaseQuantity () {
    inquirer
    .prompt({
        name: "itemQuantity",
        type: "input",
        message: "How many of item " + buyID + " would you like to purchase?",
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
        buyQuantity = answer.itemQuantity;

        //set up if statement to compare buyQuantity to available quantity
        //set up mysql connection to take in price and multiply by buyQuantity for total purchase amount
        //update mysql table by taking stock quantity and subtract buyQuantity
    
        console.log("You will be purchasing " + buyQuantity + " of item " + buyID + "! Thank you for your business!")
    });
    
};