<?php
// +---------------------------------------------------------------------------
// +  Datei: proxy.php      UTF-8
// +  AutorIn:  Lukas Bisdorf
// +  Beschreibung: Wraps the nodes.json to work around the CORS problem+
// +  with ajax requests.
// +  KorrektorIn:
// +  Status:
// +  Revision: 2018-05-17
// +---------------------------------------------------------------------------


$file = file_get_contents("https://map.ffrn.de/data/meshviewer.json");
if (!$file){
	$file = "{}";
}

header('Content-Type: application/json');
echo $file;

?>