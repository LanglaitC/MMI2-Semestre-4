<?php

class Bar {
  private $id;
  private $placeID;

  function construct() {
    $this->id = "inconnu";
    $this->placeID = "inconnu";
  }

  function getPOST(){
    if(isset($_POST["placeid"]) && $_POST["placeid"] != "")
    $this->id = $_POST["placeid"];
  }
}

class Biere {
  private $id;
  private $url;
  private $name;

  function afficheForm(){
    $chaine = '<form action="index.php?action=insert" method="post" enctype=”multipart/form-data id="listForm"”>';
    $chaine .= $this->selectAll();
    $chaine .='<input type="submit" /></form>';
    return ($chaine);
  }

  function affiche() {
    $chaine = "<input name='biere".$this->id."' type='checkbox' value='".$this->id."'/>
      <p>".$this->name."</p>
      <img src=img/".$this->url." width='200'></img>";
    return $chaine;
  }

  function insertBD() { //Insère une image dans la base de donneés
  try {
    $pdo = new PDO('mysql:host=base.iha.unistra.fr;dbname=langlait_PTMU4', 'langlait', 'Yb591509');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // construction de la requête
    $sql = 'insert into liste (ID, titre, description, URL, dateCreation, color)
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

  function selectAll(){ //Selectionne toutes les images de la base de donneés
    try {
      $pdo = new PDO('mysql:host=base.iha.unistra.fr;dbname=langlait_PTMU4', 'langlait', 'Yb591509');
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // construction de la requête
      $sql = 'select * from bieres;';
      // exécution de la requête
      $result = $pdo->query($sql);

      // on récupère la première ligne du résultat

      $tableau = [];

      while ($objet = $result->fetch(PDO::FETCH_OBJ)) {

        $this->id = $objet->id_biere;
        $this->url = $objet->url_logo;
        $this->name = $objet->nom;
        array_push($tableau, [$this->id, $this->url, $this->name]);

      }

      return $tableau;

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

    return $chaine;
  }

  function getPOST(){
    $array = [];
    for($i = 0; $i <= 10; $i++){
      if(isset($_POST["biere".$i]))
      array_push($array, $_POST["biere".$i]);
    }
    return $array;
  }



}

class Liste {
  private $id;
  private $liste;

  function __construct(){
    $this->liste = [];
    // for($i = 0; $i <= count($array)-1; $i++){
    //   array_push($this->liste, $array[$i]);
    // }
    $this->id = "inconnu";
  }

  function getPOST(){
    if(isset($_POST["listContent"]))
    $this->liste = $_POST["listContent"];
    if (isset($_POST["id"]) && $_POST["id"] != "")
    $this->id = $_POST["id"];
  }

  function affiche(){
    print "<div class=listeContener>";

    print "</div>";
  }

  function selectAll(){ //Selectionne toutes les images de la base de donneés
    try {
      $pdo = new PDO('mysql:host=base.iha.unistra.fr;dbname=langlait_PTMU4', 'langlait', 'Yb591509');
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      // construction de la requête
      $sql = 'select * from relation_biere where id_bar ="'.$this->id.'";';
      // exécution de la requête
      $result = $pdo->query($sql);

      // on récupère la première ligne du résultat

      while ($objet = $result->fetch(PDO::FETCH_OBJ)){

        $this->id = $objet->id_liste_biere;
        for($i=1; $i < count($this->liste); $i++){
          array_push($this->liste, $objet->id_biere.$i);
        }
        //$this->affiche();
        var_dump($this->liste);
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
    $pdo = new PDO('mysql:host=base.iha.unistra.fr;dbname=barbarou', 'barbarou', 'NNGuXtBXyFedRi32');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // construction de la requête


    for($i = 0; $i < count($this->liste); $i++){
      $sql = "insert into relation_biere (place_id, id_biere) values ('".$this->id."', ".$this->liste[$i].");";
      //$sql .= ", id_biere".$i;
      var_dump($sql);

    $nb = $pdo->exec($sql);
    print "La vignette a bien été insérée";
  }



    //exécution de la requête


    // récupération de la dernière clé créée (auto-incrément)
    // $this->id = $pdo->lastInsertId();

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
