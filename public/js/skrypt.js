// zmienna pozwalajaca przechowac zawartosc pliku user.txt w ktorym znajduje sie login zalogowanego uzytkownika
var x;

// pobieranie pliku user.txt
$.get('../uploads/user.txt', function(data){
      x = data;

// wyswietlanie tabeli zawierajacej dane z pliku JSON
$.getJSON("../uploads/" + x +"/database.json", function(data){
    var dane = data;
    var wpis = "Brak plikow";
    var out = "<table>" + "<tr>" + "<td>" + "Nazwa pliku" + "</td>" + "<td>" + "Rozmiar pliku" + "</td>" + "<td>" + "Rozszerzenie" + "</td>" + "</tr>";
    
    if(dane["files"].length == 0) {
        out += "<tr>" + "<td>" + wpis + "</td>" + "</tr>";
    }
    else{
        for(var i=0; i<dane["files"].length; i++){        
            out  += "<tr>" +
            "<td>" + dane["files"][i].name + "</td>" +
            "<td>" + dane["files"][i].size + "</td>" +
            "<td>" + dane["files"][i].extension + "</td>" +
            "</tr>";
        }
    }
    
     out += "</table>";
     document.getElementById("table").innerHTML = out;
}); 
});


