<?php
	//On récupére la liste de produits d'un bar donner et on retourne sous forme de json
	
	header('Content-Type: text/html; charset=utf-8');
	$con = mysqli_connect("base.iha.unistra.fr","barbarou","NNGuXtBXyFedRi32","barbarou");
	$place_id = $_GET["place_id"];
	$fetch = mysqli_query($con,"SELECT nom, description, url_logo FROM bieres NATURAL JOIN relation_biere 
	WHERE relation_biere.place_id ='".$place_id."' AND relation_biere.id_biere = bieres.id_biere");
	while($row = mysqli_fetch_assoc($fetch)) {
		$return_arr[] = array(
			"nom" => $row["nom"],
			"description" => $row["description"],
			"url" => $row["url_logo"]
		);
    }
	mysqli_close($con);
	echo json_encode($return_arr);
?>