var mysql = require("mysql");
var inquirer = require ("inquirer");
var colors = require('colors/safe');

var buyID = '';
var buyQuantity = 0;
var stockCheck = 0;

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

    showDatabase();

});

function showDatabase () {
  connection.query('SELECT * FROM bamazon.products', function(err, response){
    if(err) throw err;
    
    console.table(response);

    bamazonStart();
  });
}

function bamazonStart () {
  inquirer.prompt({
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
  
      checkStock();
    });

    
};

function checkStock () {
  connection.query("SELECT stock_quantity FROM products WHERE item_id=?", buyID, function(err, response) {
    if(err) throw err;

    stockCheck = +response[0].stock_quantity - +buyQuantity;

    if (stockCheck > 0) {
      ringUp ();
    } else {
      console.log(colors.yellow.bgBlack(`We're sorry, but either we are out of item ${buyID} or we do not have enough stock (${+response[0].stock_quantity} available). \nPlease adjust the quantity you'd like to order or check back in a few weeks for a restock. Thank you!`));

      showDatabase();
    }

  });
};

function ringUp () {
  connection.query("SELECT price FROM products WHERE item_id=?", buyID, function(err, response) {
    if(err) throw err;

    var orderTotal = (+response[0].price * +buyQuantity).toFixed(2);

    console.log(colors.red.bold(`Your order total will be $${orderTotal}.`));

    updateStock();
  });
};

function updateStock () {
  var sqlUpdate = `UPDATE products SET stock_quantity=? WHERE item_id=?`;
  var item_data= [stockCheck, buyID];

  connection.query(sqlUpdate, item_data, function(err, response) {
    if(err) throw err;

  console.log(colors.red.bold(`You are now purchasing ${buyQuantity} of item ${buyID}. There are now ${stockCheck} available for purchase. \nThank you for your business. Have a great day!`));

  showDatabase();
  });
};
