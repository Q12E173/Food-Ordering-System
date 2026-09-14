<?php

include('databaseConnection.php');
session_start();
session_destroy();

echo '<meta http-equiv="refresh" content="0.50;url=main.html">'; //delay of 0.50seconds 

?>