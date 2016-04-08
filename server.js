var app = require('./app');

var server = require('http').createServer(app).listen(app.get('port'), function () {
    console.log('Express (' + app.get('env') + ') server listening on port ' + app.get('port'));
});

var io = require("socket.io").listen(server);
var shortid = require("shortid");

var clients = [];

io.on('connection', function (socket){

  	var userCurrent;

  	socket.on('User_Connect', function (){

  		console.log('User Connected: ');

  		for(var i=0; i<clients.length; i++){

  			socket.emit('User_Connnected',{

  				name: clients[i].name,
  				id: clients[i].id,
  				position: clients[i].position

  			});

  			console.log('User name ' + clients[i].name + ' is Connected...');

  		}

  	});

    socket.on('Play', function (data){

        userCurrent = {
          name: data.name,
          id: shortid.generate(),
          position: data.position
        }

        clients.push(userCurrent);
        socket.emit('Play', userCurrent);
        socket.broadcast.emit('User_Connnected', userCurrent);

    });

    socket.on('Move', function (data){

        userCurrent.position = data.position;
        userCurrent.rotation = data.rotation;

        socket.broadcast.emit('Move', userCurrent);
        //console.log(userCurrent.name+ " Move To: " + userCurrent.position + " rotation to " + userCurrent.rotation);

    });

    socket.on("disconnect", function(){

        socket.broadcast.emit('User_Disconnected',userCurrent);
      
        for (var i = 0; i < clients.length; i++) {
          if (clients[i].name === userCurrent.name && clients[i].id === userCurrent.id) {

            console.log("User "+clients[i].name+" id: "+clients[i].id+" disconnected");
            clients.splice(i,1);

          };
        };

    });

});
