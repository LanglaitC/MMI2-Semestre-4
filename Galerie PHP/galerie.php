<!DOCTYPE html>
<html>
<head>
	<title>Galerie</title>
	<meta charset="utf-8">
	<meta name="author" content="Langlait Corentin">
	<link media="screen"  rel="stylesheet" href="style.css" />
</head>
<body>
	<header>
		<h1>Galerie d'images</h1>
	</header>
<?php

include('class.php');

//On crée une nouvelle image
if (isset($_GET['action'])) $action = $_GET['action']; else $action = '';

// définition de l'action par défaut
if (empty($action)) $action = 'list';

// récupération de la clé si elle existe
if (isset($_GET['id'])) $id= $_GET['id']; else $id= 0;
// cela pourrait être fait dans une méthode getId() de la classe Image (voir cas delete)

// création d'un objet pour appeler les méthodes
$image = new Image();

// choix de l'action
switch ($action) {
    case 'list':
        $image->selectAll();        // afficher toutes les images
				$image->afficheFormulaire('galerie.php?action=insert');
        break;
    case 'select':
        $image->selectBD($id);   // afficher le détail de l'image sélectionnée
        $image->afficheDetail();
        break;
    case 'update':
				$id = $image->getId();
				if (isset($_POST["titre"]) && !empty($_POST["titre"])) {
					$image->getPOST();
					$image->updateDB($id);
				}
        $image->selectBD($id);   // récupérer les données de l'image sélectionnée et l'affiche
        $image->afficheFormulaire('galerie.php?action=update&id='.$id.'');
				echo "<br /> <a href='galerie.php'>Retour a la galerie</a>";
        break;
    case 'delete':
        $id = $image->getId();   // exemple avec la clé récupérée par une méthode
        $image->delete($id);
        $image->selectAll();        // affiche la liste après la suppression
				$image->afficheFormulaire('galerie.php?action=insert');
        break;
    case 'insert':
        $image->getPOST();       // récupère les données envoyées par le formulaire
        $image->insertBD();      // réalise l'insertion dans la base de données
				$image->selectBD($id);   // récupérer les données de l'image sélectionnée
				echo "<br /><a href='galerie.php'>Retour</a>";
        break;
}
?>
</body>
