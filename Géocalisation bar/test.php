<?php
	//On récupere et on retourne en json les place_id de la BDD
	$con = mysqli_connect("base.iha.unistra.fr","barbarou","NNGuXtBXyFedRi32","barbarou");
	$fetch = mysqli_query($con,"SELECT DISTINCT place_id FROM relation_biere");
	foreach ($fetch as $key => $value) {
	  foreach ($value as $key => $value2) {
	    $return_arr[] = array(
	      "placeid" => $value2
	    );
	  }
	}
	mysqli_close($con);
	echo json_encode($return_arr);
	
	
 ?>
