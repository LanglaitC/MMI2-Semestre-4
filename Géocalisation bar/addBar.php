<?php
include("class.php");
$action = isset($_POST["action"]) && $_POST["action"] != "" ? $_POST["action"] : "select";
//Contoleur
switch($action){
  case 'select':
    getMarker();
    break;
  case 'getForm':
    $biere = new Biere();
    //On retourne le formulaire permettant de choisir les bières
    echo json_encode($biere->selectAll());
    break;
  case 'insert':
  // On récupère la liste et le placeID du bar avant de tout inserer dans la BDD
    $liste = new Liste();
    $liste->getPOST();
    $liste->insertBD();

    break;
}


?>
