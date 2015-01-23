/* jshint node: true */
var app = require("express")();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);

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

/* io.sockets.on("connection", function (socket) {
    socket.on("message", function (data) {
        io.sockets.emit("echo", "No tak, tak – dostałem: " + data);
    });
    socket.on("error", function (err) {
        console.dir(err);
    });
}); */

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
    res.end("File loaded.");     
  }
});


httpServer.listen(port, function () {
    console.log('Serwer HTTP działa na porcie ' + port);
});
