/* jshint node: true */
var app = require("express")();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);
var database = require('./json/taffy-min.js').taffy(require('./json/database').files);

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

app.get('/api/:adv', function (req, res) {
    var files = database ({
		Id: req.params.adv
    }).select('Name');
    res.json(files);
});

app.use(multer({ dest: './uploads/',
    rename: function (fieldname, filename) {
    return filename+Date.now();
  },
        onFileUploadStart: function (file) {
          console.log(file.originalname + ' jest wrzucany na serwer ...')
        },
        onFileUploadComplete: function (file) {
          console.log(file.fieldname + ' wrzucono do  ' + file.path)
          done=true;
        }               
}));

app.get('/',function(req,res){
      res.sendfile("./public/index.html");
});

app.post('',function(req,res){
  if(done==true){
    console.log(req.files);
    req.files.name >> '/nowyplik.txt';
    res.redirect("back");  
  }
});


httpServer.listen(port, function () {
    console.log('Serwer HTTP działa na porcie ' + port);
});
