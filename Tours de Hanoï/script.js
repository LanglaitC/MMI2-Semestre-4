var canvas = document.getElementById("canvas");
var ctxte = canvas.getContext("2d");



function Pile() {
  this.elements = new Array();
  this.hauteur = 0;
}

Pile.prototype.tete = function() {
  return this.elements[this.hauteur-1];
}

Pile.prototype.empile = function(rayon) {
  this.elements[this.hauteur]=rayon;
  this.hauteur = this.hauteur + 1;

}

Pile.prototype.depile = function() {
  this.hauteur = this.hauteur - 1;
}

Pile.prototype.vide = function() {
  if(this.hauteur == 0){
    return true;
  }else {
    return false;
  }
}

Pile.prototype.dessine = function(x, y){
  ctxte.rect(x,y,160,14);
  ctxte.rect(73+x,0,14,y);
  for(var i = 0; i < this.hauteur; i++){
    rect1 = ctxte.rect(x+y-10*this.elements[i], y-20-20*i,  (x+10+10*this.elements[i]) - (x+y-10*this.elements[i]), 20);
    //ctxte.lineTo(x+10+10*this.elements[i], y-20-20*i);
  }
  ctxte.stroke();

}
var piles = new Array(3);

piles[0] = new Pile();
piles[1] = new Pile();
piles[2] = new Pile();
for( var i = 4; i >= 0; i--){
  piles[0].empile(i+10);
}

function dessine(){
  ctxte.beginPath();
  ctxte.clearRect(0, 0, canvas.width, canvas.height);
  piles[0].dessine(0, 150);
  piles[1].dessine(300, 150);
  piles[2].dessine(600, 150);

}

function echange(piles, a, b){
  var rayon = piles[a].tete();
  if (piles[a].tete() < piles[b].tete() || piles[b].vide()) {
    piles[a].depile();
    piles[b].empile(rayon);
  }
  dessine();
}






document.getElementById("onetotwo").addEventListener("click", function(){
  echange(piles, 0, 1)
})

document.getElementById("onetothree").addEventListener("click", function(){
echange(piles, 0,2);
})

document.getElementById("twotothree").addEventListener("click", function(){
echange(piles, 1,2);
})

document.getElementById("twotoone").addEventListener("click", function(){
echange(piles, 1, 0);
})

document.getElementById("threetoone").addEventListener("click", function(){
echange(piles, 2, 0);
})

document.getElementById("threetotwo").addEventListener("click", function(){
echange(piles, 2, 1);
})
