


$.getJSON("../../uploads/kulwik@gmail.com/database.json", function(data){
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

