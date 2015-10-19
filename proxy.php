<?php
// +---------------------------------------------------------------------------
// +  Datei: proxy.php      UTF-8
// +  AutorIn:  Lukas Bisdorf
// +  Beschreibung: Wraps the nodes.json to work around the CORS problem+
// +  with ajax requests.
// +  KorrektorIn:
// +  Status:
// +  Revision: 2014/07/28
// +---------------------------------------------------------------------------


$file = file_get_contents("http://map.ffrn.de/data/nodes.json");
echo $file;

?>