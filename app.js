/* jshint node: true */
// global $: false

var app = require("express")();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);
var done = false;
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('client-sessions');

    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;

    //mongoose user model
    var User = mongoose.model('User', new Schema({
        id: ObjectId,
        firstName: String,
        lastName: String,
        email: { 
            type: String, 
            unique: true
        },
        password: String,
    }));

var static = require('serve-static');
var less = require('less-middleware');
var path = require('path');
var multer = require('multer');
var port = process.env.PORT || 3000;

app.use(less(path.join(__dirname, 'public/stylesheets')));
app.use('/img', static(__dirname + '/public/img'));
app.use('/js/jquery.min.js', static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use('/js/jquery.min.map', static(__dirname + '/bower_components/jquery/dist/jquery.min.map'));
app.use(static(path.join(__dirname, '/public')));

    //connect to mongodb auth is a name of collection in MongoDB
        mongoose.connect('mongodb://localhost/auth');

    // middleware
        app.use(bodyParser.urlencoded({extended : true}));
    // configure session
        app.use(session({           
            cookieName: 'session',
            secret: 'randomnametokryptsession',
            duration: 60 * 1000, // in miliseconds end session after 1hour
            aciveDuration: 5 * 60 * 1000,
        }));


        app.set('view engine', 'jade');
        app.locals.pretty = true;

var outputFilename = 'public/json/database.json';
var file_name = "";
var date = new Date();
var username = "";

function change(x)
{
    if (x<10){
        x= "0" + x;
        return x;
    }
    else{
        return x;
    }
}

var d = " (" + date.getFullYear() + "-" + change(date.getMonth())+ "-" + change(date.getDay())+ " " + change(date.getHours())+ ":" + change(date.getMinutes())+ ":" + change(date.getSeconds()) + ")";

    fs.readFile(outputFilename, function (err, data) {
        if (err) throw err;
        var json = JSON.parse(data);
           
            app.use(multer({ dest: './uploads/' + username,                                                                          
            rename: function (fieldname, filename) {               
                    return filename + Date.now();
                },
                                                                   
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' jest dodawany ...')
    },
    onFileUploadComplete: function (file, originalname, extension, size, encoding) {
      console.log(file.originalname + ' dodano do  ' + file.path)
      
      var number = file.extension.length + 1;
        
      var file_data = {
          "name": file.originalname.slice(0, -number)+d,
          "originalname": file.originalname,
          "extension": file.extension,
          "size": Math.round((file.size/1024)) + "KB",
          "encoding": file.encoding
      };
      
      json.files.unshift(file_data);
      
      fs.writeFile(outputFilename,JSON.stringify(json, null, 4), function(err){
         if (err){
             console.log(err);
         } 
          else{
              console.log("Dodano te dane?!");
          }
      });       
                
      done=true;
    }
}));
        
app.get('',function(req,res){
      res.render("index.jade");
});

        // render views to login
        app.get('/register', function(req,res){
            res.render("register.jade");
        }); 
        
        app.post('/register', function(req,res){
            var user = new User({            
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            });
            
            user.save(function(err) {
                if(err) {
                    var err = 'Błąd przy rejestracji! Spróbuj ponownie';
                    
                    // mongodb sprawdza czy wprowadzony email jest w bazie mongodb
                    // email UNIQUE
                    if (err.code === 11000){
                        error = 'Wprowadzono już taki adres email. Wprowadz inny';
                }
                    res.render('register.jade', { error: error});     
            } 
                else{
                        res.redirect('/dashboard');
                        username = req.body.email;
                       fs.mkdir('./uploads/' + username );
                       fs.writeFile('./uploads/' + username + "/" + "database" + ".json", '{"files":[] }');
                    }
        });
        });

        app.get('/login', function(req,res){
            res.render("login.jade");
        }); 
        
        app.post('/login', function(req,res){
            User.findOne({ email: req.body.email }, function (err, user){
                if (!user){
                    res.render('login.jade', { error: 'Invalid email or password.'});
                }
                else{
                    if (req.body.password === user.password){
                        req.session.user = user;
                        res.render("index.jade");
                        fs.readFile('./uploads/' + user.cookieName + "/" + "database.json")
                    }
                    else {
                        res.render('login.jade', { error: 'Invalid email or password.'});
                    }
                }
            });
        }); 

        app.get('/dashboard', function(req,res){
            if (req.session && req.session.user) {
                User.findOne({ email: req.session.user.email}, function(err, user){
                    if (!user){
                        req.session.reset();
                        res.redirect('/login');
                    }
                    else{
                        res.locals.user = user;
                        res.render('dashboard.jade')
                    }
                });
            }
            else{
                res.redirect('/login');
            }
            console.log(req.body);
            res.render("dashboard.jade");
        });

        app.get('/', function(req, res){
           res.redirect("index.jade"); 
        });

        app.get('/logout', function(req, res){
           res.redirect("/"); 
        });
        
        
        
app.post('',function(req,res){
  if(done==true){     
        console.log(req.files);
        res.redirect("/login");
  }     
});         
});
               
/*Run the server.*/
app.listen(3000,function(){
    console.log("Serwer pracuje na porcie 3000");
});