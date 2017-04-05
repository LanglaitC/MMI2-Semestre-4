<?php

class Image {
  private $id;
  public $titre;
  public $description;
  private $url;
  public $file;
  private $date;
  private $color;

  function __construct() { //Attribue des valeurs par défaut a l'imaga
    $this->id = 0;
    $this->titre = "Inconnu ";
    $this->description = "Inconnu";
    $this->url = "Inconnu";
    $this->date = "Inconnu";
    $this->color= "blue";
  }

  function setAttributs($id, $titre, $description, $url, $date) {
    $this->id = intval($id); // tranforme $id en entier, pour être sur du type
    $this->titre = $titre;
    $this->description = $description;
    $this->url = $url;
    $this->date = $date;
  }

  function getId() {    //Retourne la valeur de l'id
    return $_GET['id'];
  }

  function afficheDetail($i) {    //Permet d'afficher une vignette d'image
    print ('<div class="galerieContener" style="background:'.$this->color.'">
    <div class="contentContener">
    <img src="images_uploads/'.$this->url.'" class="imageGalerie" />
    <div class="descriptionContener">
    <h2>'.$this->titre.'</h2>
    <p>'.$this->description.' Crée le '.$this->date.'</p>
    <a class="deleteButton" href="galerie.php?action=delete&id='.$this->id.'">X</a>
    <div class="modifSection">
    <button class="modifButton"><a href="galerie.php?action=update&id='.$this->id.'">Modifier l\'image</a></button>
    <form class="modifForm">
    <label>Le nouveau lien de l\'image</label>
    <input name="url" type="text"/>
    <input type="submit" />
    </form>
    </div>
    </div>
    </div>
    </div>');
  }


  function afficheFormulaire($url) { //Affiche le formulaire avec les valeurs du constructeur préentrée
                                     //Ajout d'une fonction de choix de couleurs de vignette
    print ('
    <div class="formContener">

    <h1>Insérer une nouvelle image</h1>
    <form action="'.$url.'" method="post" enctype="multipart/form-data">
    <input type="text" name="titre" placeholder="Titre" value="'.$this->titre.'"> <br />
    <input type="text" name="description" placeholder="Description" value="'.$this->description.'"> <br />
    <input type="hidden" name="MAX_FILES_SIZE" value="204800"/>
    <input type="file" name="image"/> <br />
    <select name="color">
      <option value="rgb(74, 122, 177)">Bleu</option>
      <option value="rgb(224, 161, 110)">Orange</option>
      <option value="rgb(250, 101, 128)">Rouge</option>
      <option value="rgb(97, 228, 161)">Vert</option>
    </select>
    <input type="submit" id="submit" />
    </form>
    </div>');
  }

  function getPOST() {
    if (isset($_POST["titre"]) && !empty($_POST["titre"]))
    $this->titre = $_POST["titre"];
    if (isset($_POST["description"]) && !empty($_POST["description"]))
    $this->description = $_POST["description"];
    if (isset($_POST["image"]) && !empty($_POST["image"])){
    $this->file = $_POST["image"];
  }
  if (isset($_POST["color"]) && !empty($_POST["color"]))
  $this->color = $_POST["color"];

  if (isset($_FILES['image']['name']) && !empty($_FILES['image']['name'])) {
  $temp = $_FILES['image']['tmp_name'];
  $name = $_FILES['image']['name'];
  $size = $_FILES['image']['size'];
  $type = $_FILES['image']['type'];


  $this->url = $_FILES['image']['name'];

  // déplacement du fichier reçu
  move_uploaded_file($temp, 'images_uploads/'.$name);
} else {
  print("Aucune image reçue !");
  exit;
}
    $this->date = date('Y-m-d');
  }



  function selectBD($id){ //Selectionne une image particulière en fonction de son id
    try{
      $pdo = new PDO('mysql:host=corentinpilang.mysql.db;dbname=corentinpilang', 'corentinpilang', 'Yb591509');
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // construction de la requête
      $sql = 'select * from image where id = '.$id.';';
      // exécution de la requête
      $result = $pdo->query($sql);

      // on récupère la première ligne du résultat
      $objet = $result->fetch(PDO::FETCH_OBJ);
      if (!empty($objet)){
        $this->id = $objet->ID;
        $this->titre = $objet->titre;
        $this->description = $objet->description;
        $this->url = $objet->URL;
        $this->date = $objet->dateCreation;
        $this->color = $objet->color;
        $this->afficheDetail($this->id);

      // fin de la connexion
      $pdo = null;
      }
    }
    catch (Exception $e){
      // code exécuté si une erreur à lieu dans le bloc try
      print('<p>Erreur : '.$e->getMessage().'</p>');
      exit;
    }
  }

  function selectAll(){ //Selectionne toutes les images de la base de donneés
    try {
      $pdo = new PDO('mysql:host=corentinpilang.mysql.db;dbname=corentinpilang', 'corentinpilang', 'Yb591509');
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // construction de la requête
      $sql = 'select * from image;';
      // exécution de la requête
      $result = $pdo->query($sql);

      // on récupère la première ligne du résultat

      while ($objet = $result->fetch(PDO::FETCH_OBJ)) {

        $this->id = $objet->ID;
        $this->titre = $objet->titre;
        $this->description = $objet->description;
        $this->url = $objet->URL;
        $this->date = $objet->dateCreation;
        $this->color = $objet->color;
        $this->afficheDetail($this->id);

      }

      // else {
      // 	print('<p>Erreur : image inexistante '.$id.'</p>');
      // }

      // fin de la connexion
      $pdo = null;
    }
    catch (Exception $e) {
      // code exécuté si une erreur à lieu dans le bloc try
      print('<p>Erreur : '.$e->getMessage().'</p>');
      exit;
    }
  }



  function insertBD() { //Insère une image dans la base de donneés
    try {
      $pdo = new PDO('mysql:host=corentinpilang.mysql.db;dbname=corentinpilang', 'corentinpilang', 'Yb591509');
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // construction de la requête
      $sql = 'insert into image (ID, titre, description, URL, dateCreation, color)
      values (\'\', "'.$this->titre.'",
      "'.$this->description.'", \''.$this->url.'\', \''.$this->date.'\', \''.$this->color.'\');';

      // exécution de la requête
      $nb = $pdo->exec($sql);
      print "La vignette a bien été insérée";

      // récupération de la dernière clé créée (auto-incrément)
      $this->id = $pdo->lastInsertId();

      // fin de la connexion
      $pdo = null;
    }
    catch (Exception $e) {
      // code exécuté si une erreur à lieu dans le bloc try
      print('<p>Erreur : '.$e->getMessage().'</p>');
      exit;
    }
  }

    function updateDB($id) { //Permet de modifier une vignette dans la base de donneés
  		try {
  			// connexion
        $pdo = new PDO('mysql:host=corentinpilang.mysql.db;dbname=corentinpilang', 'corentinpilang', 'Yb591509');
  			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  			// construction de la requête
  			$sql = 'update image set titre = "'.$this->titre.'", description = "'.$this->description.
  				'", URL = \''.$this->url.'\', dateCreation = \''.$this->date.'\', color = \''.$this->color.'\' where id = '.$id.';';

  			// exécution de la requête
  			$nb = $pdo->exec($sql);
        echo " <br /> Votre vignette a bien été mise a jour, veuillez retourner a la galerie";

  			// fin de la connexion
  			$pdo = null;
  		}
  		catch (Exception $e) {
  			// code exécuté si une erreur à lieu dans le bloc try
  			print('<p>Erreur : '.$e->getMessage().'</p>');
  			exit;
  		}
  	}

  function delete($i) { //Supprime une image dans la base de donneés
    try {
      // connexion
      $pdo = new PDO('mysql:host=corentinpilang.mysql.db;dbname=corentinpilang', 'corentinpilang', 'Yb591509');
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // construction de la requête
      $sql = 'delete from image where id = '.$i.';';

      // exécution de la requête
      $nb = $pdo->exec($sql);

      // fin de la connexion
      $pdo = null;
    }
    catch (Exception $e) {
      // code exécuté si une erreur à lieu dans le bloc try
      print('<p>Erreur : '.$e->getMessage().'</p>');
      exit;
    }


  }



}

?>
