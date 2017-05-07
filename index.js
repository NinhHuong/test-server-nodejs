var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false});
var pg = require('pg');
config = {
  user: 'zjzhfgfgtjulih',
  database: 'd2ttqbcsm1cv9c',
  password: '588ecad81195b7dcb9119206b219ec35f9203c0f0e39dc694763ca13903550e0',
  host: 'ec2-184-73-199-72.compute-1.amazonaws.com',
  port: 5432,
  ssl: true,
  max: 10,
  idleTimeoutMillis: 30000,
}
//init a connection pool
//keep connections open for 30 secondes
//set limit of max 10 idle clients
var pool = new pg.Pool(config);

//show list
app.get("/student/list", function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM student', function(err, result) {
      //call 'done()' to release the client back to the pool
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      console.log("total row: ", result.rows.length);

      res.render("student_list.ejs", {list_result:result});
    });
  });
});

//insert
app.get("/student/add", function(req, res) {
  pool.connect(function(err, client, done) {
    res.render("student_insert.ejs");
  });
});

app.post("/student/add", urlencodedParser, function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var fullname = req.body.txt_full_name;
    var email = req.body.txt_email;
    client.query("INSERT INTO student (fullname,email) VALUES ('" + fullname + "','" + email + "')", function(err, result) {
      //call 'done()' to release the client back to the pool
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.redirect("../student/list");
    });
  });
});

//edit
app.get("/student/edit/:id", function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var id = req.params.id;
    client.query("SELECT * FROM student WHERE id='" + id + "'", function(err, result) {
      //call 'done()' to release the client back to the pool
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      console.log("total row: ", result.rows.length);

      res.render("student_edit.ejs", {student:result.rows[0]});
    });
  });
});
app.post("/student/edit", urlencodedParser, function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var id = req.body.txt_id;
    var fullname = req.body.txt_full_name;
    var email = req.body.txt_email;
    client.query("UPDATE student SET fullname='" + fullname + "', email='" + email + "' WHERE id='" + id + "'", function(err, result) {
      //call 'done()' to release the client back to the pool
      done();

      if(err) {
        res.end();
        return console.error('error running query', err);
      }
      res.redirect("../student/list");
    });
  });
});

app.get('/', function(request, response) {
  response.render('main');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


