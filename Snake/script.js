var bonjour=1
var solID = 1
var a = 0;


function Anneau(x, y, anneauClass) {
  ++bonjour;
  this.id= bonjour;
  this.x = x;
  this.y = y;
  this.anneauClass = anneauClass
  elt = document.createElement("div");
  elt.setAttribute("id", bonjour);
  elt.setAttribute("class", anneauClass);
  document.body.appendChild(elt);
}

function Serpent(xVal, yVal, xPos, yPos){
  this.longueur = xVal;
  this.niveau = yVal;
  this.tete = new Anneau(xPos, yPos, "tete");
  this.queue = new Anneau(xPos+xVal, yPos, "queue")
  if(xVal => 2){
    this.anneau = [];
    for (var j = 0; j <= xVal-2; j++) {
      this.anneau.push(new Anneau(xPos+1+j, yPos, "anneau"))
      this.anneau[j].position();
    }
  }
}


Anneau.prototype.position = function(){
  document.getElementById(this.id).style.left = (this.x)*20 + "px";
  document.getElementById(this.id).style.top = (this.y)*20 + "px";
}

Serpent.prototype.position = function(){
  this.tete.position();
  this.queue.position();
}

var serpent = new Serpent(3, 10, 10, 5);
serpent.position();
//var serpent2 = new Serpent(3, 15, 15, 15);
//var serpent3 = new Serpent(3, 20, 20, 20);

//serpent2.position();
//serpent3.position();



Anneau.prototype.deplacement = function(deplacement){
  var code = this.lecture(deplacement);
  if (code == 3 || code == 1) {
    switch (deplacement) {
      case "haut":
        this.y -=1;
        break;
      case "gauche":
        this.x -=1;
        break;
      case "droite":
        this.x +=1;
        break;
      case "bas":
        this.y +=1;
        break;
      }

      this.position();
      if(code == 3) {
        return 2;
      } else {
        return 0;
      }
    } else {
      return(1)
    }



  }

Anneau.prototype.lecture = function(deplacement){
  switch (deplacement) {
    case "haut":
      return terrain.lecture(this.x, this.y-1);
    case "gauche":
      return terrain.lecture(this.x-1, this.y);
    case "droite":
      return terrain.lecture(this.x+1, this.y);
    case "bas":
      return terrain.lecture(this.x, this.y+1);
  }
  }

Serpent.prototype.ajouter = function(){
  this.anneau.push(new Anneau(this.anneau[this.anneau.length-1].x, this.anneau[this.anneau.length-1].y, "anneau"));
  this.anneau[this.anneau.length-1].position();
}

document.getElementById("ajouter").addEventListener("click", function(){
  serpent.ajouter();
})

// document.getElementById("terrain").addEventListener("click", function(){
//     terrain.ecriture(10,5,1);
//     terrain.ecriture(11,5,1);
//     terrain.ecriture(12,5,1);
//     terrain.ecriture(13,5,1);
//     terrain.affiche();
// })


Serpent.prototype.deplacement = function(deplacement, i){
  i++
  if(this.tete.lecture(deplacement) == 1){
    this.queue.copie(this.anneau[this.anneau.length-1]);
    terrain.ecriture(this.queue.x, this.queue.y, 1)
    for(i = this.anneau.length-1; i > 0; i--){
      this.anneau[i].copie(this.anneau[i-1]);
    }
    this.anneau[0].copie(this.tete);
    this.tete.deplacement(deplacement);
    terrain.ecriture(this.tete.x, this.tete.y, 2);

   }
  else if(this.tete.deplacement(deplacement) == 2) {
    console.log("bonjour")
    this.queue.copie(this.anneau[this.anneau.length-1]);
    terrain.ecriture(this.queue.x, this.queue.y, 1)
    for(i = this.anneau.length-1; i > 0; i--){
      this.anneau[i].copie(this.anneau[i-1]);
    }
    this.anneau[0].copie(this.tete);
    serpent.ajouter();
    terrain.ecriture(this.tete.x, this.tete.y, 1);
    terrain.affiche();

    console.log(terrain.sol[terrain.code]);

    terrain = new Terrain(terrain.longueur,terrain.largeur);
    terrain.affiche();

    terrain.ecriture(this.tete.x, this.tete.y, 1);






  }
  // else {
  //   switch (i) {
  //     case 1:
  //       this.deplacement("bas", i)
  //     break;
  //     case 2:
  //       this.deplacement("haut", i)
  //     break;
  //     case 3:
  //       this.deplacement("gauche", i)
  //     break;
  //     case 4:
  //       this.deplacement("droite", i)
  //     break;
  //   }
  // }

}

Serpent.prototype.independant = function() {
  var move = Math.round(Math.random()*4);
  switch (move) {
    case 1:
      this.deplacement("bas")
      break;
    case 2:
      this.deplacement("haut")
      break;
    case 3:
      this.deplacement("droite")
      break;
    case 4:
      this.deplacement("gauche")
      break;
  }
}

Anneau.prototype.copie= function(anneau){
  this.x= anneau.x;
  this.y= anneau.y;
  this.position();
}



for (var i = 0; i < serpent.length; i++) {
  serpent[i].position();
}


document.addEventListener("keydown", function(event) {
  switch (event.keyCode) {
    case 38:
    serpent.deplacement("haut", 0);
    break;
    case 40:
    serpent.deplacement("bas", 0);
    break;
    case 37:
    serpent.deplacement("gauche", 0);
    break;
    case 39:
    serpent.deplacement("droite", 0);
    break;

  }
})

// TERRAIN //

function Terrain(l, h){
  this.longueur = l;
  this.largeur = h;
  this.sol = new Array(l*h);
  for(var a = 0; a < this.sol.length; a++){
      this.sol[a] = 1;
      this.code = Math.random()
      if(this.code <= 0.2) {
        this.sol[a] = 0;
      }
  }
  // this.code = Math.round(Math.random()*l*h);
  //
  // this.sol[this.code] = 3;

  for(var i= 0; i < l; i++){
    this.sol[i] = 2;
    this.sol[l * (h-1) + i] = 2;
  }
  for (var j=0; j < h; j++){
    this.sol[j * l] = 2;
    this.sol[j * l + l - 1] = 2;
  }




}



Terrain.prototype.affiche = function(){

    for(var l = 0; l < this.longueur; l++){
      for (var m = 0; m < this.largeur; m++){
        elt = document.createElement("div");
        elt.setAttribute( "id", "sol"+(l* this.largeur + m));
        elt.setAttribute("class", "sol");
        elt.style.left = (l * 20) +"px";
        elt.style.top = (m * 20) +"px";
        if(this.sol[l* this.largeur + m] == 2){
          elt.setAttribute("class", "border");
        } else if (this.sol[l* this.largeur + m] == 0){
            elt.setAttribute("class", "roche");
          }
        else if (this.sol[l* this.largeur + m] == 3){
          elt.setAttribute("class", "pomme");

        } else if(this.sol[l* this.largeur + m] == 1){
          elt.setAttribute("class", "sol");
        }
            document.body.appendChild(elt);

        }
      }


      }




Terrain.prototype.lecture = function(i, j){
  return(this.sol[i* this.largeur + j]);
}

Terrain.prototype.ecriture = function(i, j, val){
  this.sol[i* this.largeur + j]= val;
}

Terrain.prototype.delete = function(){
  document.body.innerHTML = "";
}


var terrain = new Terrain(30, 30);

terrain.ecriture(10,5,1);
terrain.ecriture(11,5,1);
terrain.ecriture(12,5,1);
terrain.ecriture(13,5,1);
terrain.affiche();

//Animation

var animationTimer = 0;

function init(){
  serpent.independant();
  serpent2.independant();
  serpent3.independant();
}

function start() {
  setInterval(init,100);
}
//start();
