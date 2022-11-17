
<? php
// poluchenie JSON na PHP
$_POST = json_decode(file_get_contents("php://input"), true);
echo var_dump($_POST);