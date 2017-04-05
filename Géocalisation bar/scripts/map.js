var spinner = document.getElementById("spinner");
var loading_message = document.getElementById("loading_message");

//Fonction qui englobe toute les autres et qui permet d'initialiser la map
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.814646, lng: 7.789457},
    zoom: 15
  });

  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);


    // Request
    var nophp = false //Pour tester en local
    ajaxSetID('bar',service,infowindow,nophp); //Execution de la fonction pour récuperer les place_id de la base de donnée

	//Get all markers
	function ajaxSetID(type = 'bar',service,infowindow,nophp){

	  //Only for test
	  if(nophp){
	    data = [
	      {
	        'placeid': 'ChIJM3qYrN7qlkcRL-0TFps-pxo'
	      },
	      {
	        'placeid': 'ChIJ6VN-xNjqlkcRQM9OJ4zsbFI'
	      },
	      {
	        'placeid': 'ChIJI3cDndfqlkcRX75D0BxAYLQ'
	      },
	      {
		    'placeid': 'ChIJ0cpLfUzIlkcR4MFJ2FH_RF4'
	      }
	    ];
	    setMarkers(data,service,infowindow);
	  }
	  else{
	    $.ajax({
	        // 'async': false,
	        'global': false,
	        'url': "test.php",
	        'dataType': "json",
	         'data':
			    {
			    	action: "map",
			    },
	        'success': function (data) {
	             setMarkers(data,service,infowindow); //Execution de la function permettant de mettre les markers sur la map
	         },
	         'error': function(xhr,err){
			 	console.log("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
			 	console.log("responseText: "+xhr.responseText);
			 }
	    });
	  }
	};

	//Set all markers
	function setMarkers(data,service,infowindow){

	  var arr = [];
	  // On va crééer un tableau de marqueur pour savoir quel marqueur est le plus proche de nous plus tard.
	  data.forEach(function(element,index){
	    arr.push(getPlace(service, infowindow, element.placeid));
	  }); 
	  
	  //Ici on va utiliser une promesse qui nous permettra d'utiliser les marqueurs dans d'autres fonction même en asyncrone
	  //car la Promise permet d'executer une fonction lorsqu'elle à obtenu les résultats
	  Promise.all(arr).then(function(results) {
	    results.forEach(function(place,index){
	    var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
  		});
  		console.log(place);
  		
  		//Ajout du listener sur le marqueur
	  	google.maps.event.addListener(marker, 'click', function() {
		  	
		  	//On récupére les horraires d'ouvertures
		  	array = "";
		  	place.opening_hours.weekday_text.forEach(function(element){
			  	array +=element+'<br>'
		  	});
		  	
		  	//On set le content de notre infowindow (info du marqueur donc du bar)
		  	infowindow.setContent(
		  	'<div><h3>' + place.name + '</h3>' +
		  	'<p>' + place.formatted_address + '<br>' +
		  	place.formatted_phone_number + '<br>' +
		  	array +
		  	'</p>' +
		  	'<a href="'+place.url'">Voir sur Google Maps</a>' + 
		  	'</div>');
			infowindow.open(map, this);
      	});
	    });
	    var target, options;
	    
	    //Fonction success de callback de watchPosition.
	    //Si pas de position alors on affiche le logo chargement
	    function success(pos) {
		  if(action == "order"){
				spinner.style.display = "none";
				document.getElementById("global").style.display = "flex";
		  }
		  else{
			  spinner.style.display = "none";
		  }
	      var crd = pos.coords;
	      LatLng = new google.maps.LatLng(crd.latitude,crd.longitude);
	      map.setCenter(LatLng);
	      
	      //Execution de la fonction permettant de trouver le marqueur le plus proche de notre position
	      var closest = find_closest_marker(crd,results);
	      if(action == "order"){
		    document.getElementById("bar_title").innerHTML = closest.name;
		    next_order.setAttribute("place_id", closest.place_id);
	      }
	      else{
// 		      console.log(closest);
// 		      infowindow.open(map, closest);
	      }
	    }
		
		//Fonction error permettant d'afficher si l'utilisateur à refuser la localisation (code 1)
	    function error(err) {
		  if(err.code == 1){
			  loading_message.innerHTML = "Merci d'accepter la localisation !</br> Merci de recharger la page :)";
			  loading_message.style.color = "red";
		  }
	      console.warn('ERROR(' + err.code + '): ' + err.message);
	    }

	    target = {
	      latitude : 0,
	      longitude: 0
	    };

	    options = {
	      enableHighAccuracy: false,
	      timeout: 5000,
	      maximumAge: 0
	    };
	    navigator.geolocation.watchPosition(success, error, options);

	  // find_closest_marker(pos, results)
	  }).catch(function(r){
	    console.error(r)
	  });
	}

	//Function to place marker with place_id
	function getPlace(service, infowindow,request){
		var p = new Promise(function(resolve, reject) {
			service.getDetails({placeId: request},
			function(place, status) {
			    if (status === google.maps.places.PlacesServiceStatus.OK) {
				    if(place){
			      		resolve(place);
			      	}
			      	else{
				      	reject('No results found');
			      	}
			    }
		    });
		});
		return p;
	}

	//Fonction permettant d'obtenir le marqueur le plus proche de la position avec un tableau de marqueur donner
	function rad(x) {return x*Math.PI/180;}
	function find_closest_marker( crd ,markers) {
	    var lat = crd.latitude;
	    var lng = crd.longitude;
	    var R = 6371; // radius of earth in km
	    var distances = [];
	    var closest = -1;
	    for( i=0;i<markers.length; i++ ) {
	        var mlat = markers[i].geometry.location.lat();
	        var mlng = markers[i].geometry.location.lng();
	        var dLat  = rad(mlat - lat);
	        var dLong = rad(mlng - lng);
	        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
	        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	        var d = R * c;
	        distances[i] = d;
	        if ( closest == -1 || d < distances[closest] ) {
	            closest = i;
	        }
	    }
	    return(markers[closest]);
	}
}


if(action == "order"){
	var order_form = document.getElementById("order_form");
	var next_order = document.getElementById("next_order");

	//On écoute si l'utilisateur clique sur suivant
	order_form.addEventListener("submit", function(event){
		event.preventDefault();
		getBarData(next_order.getAttribute("place_id"));
		document.getElementById('firstForm').style.display = "none";
		document.getElementById('secondForm').style.display = "block";
		var numtable = document.getElementById("sample2").value;
		document.getElementById('numtable').setAttribute("value", numtable);
	});
	
	//On récupère la liste des produits disponible dans le bar dont le place_id est passer en paramètre
	function getBarData(place_id){
		$.ajax({
	        // 'async': false,
	        'global': false,
	        'url': "barInfos.php",
	        'dataType': "json",
	        'data':
			    {
				    place_id: place_id
			    },
	        'success': function (data) {
            listBiere = document.getElementById('listBiere');
		        data.forEach(function(element){
              label = document.createElement("label");
              label.className += " label-input mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect";
              label.setAttribute("for", element.id);
              listBiere.appendChild(label);
              image = document.createElement("img");
              image.setAttribute("src", "img/"+element.url);
              image.setAttribute("name", "img/"+element.nom);
              image.setAttribute("class", "image-beer");
              label.appendChild(image);
              inp = document.createElement("input");
              inp.setAttribute("type", "checkbox");
              inp.setAttribute("class", "mdl-checkbox__input");
              inp.setAttribute("id", element.id);
              label.appendChild(inp);
              par = document.createElement("span");
              par.setAttribute("class", "mdl-checkbox__label");
              par.innerHTML = element.nom;
              label.appendChild(par);
				    //document.getElementById("listBiere").innerHTML += '<label class="label-input mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="'+element.id+'"><input type="checkbox" id="'+element.id+'" class="mdl-checkbox__input"><span class="mdl-checkbox__label">'+element.nom+'</span><p>'+element.description+'</p><img class="image-beer" src="img/'+element.url+'" name="'+element.nom+'"></label>';
		        });
	         },
	         error: function (xhr, ajaxOptions, thrownError) {
              console.error(xhr.status);
              console.error(thrownError);
            }
	    });
	}
}
