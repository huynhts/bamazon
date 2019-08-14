var mysql = require("mysql");

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
        console.log('========================================================================');

    });

    connection.end();

});