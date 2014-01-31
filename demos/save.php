<?php
$action = isset($_POST['action']) && $_POST['action'] ? $_POST['action'] : 'get';
$value  = isset($_POST['value']) && $_POST['value'] ? $_POST['value'] : '';

session_start();
$data = isset($_SESSION['data']) && $_SESSION['data'] ? $_SESSION['data'] : 'Hello World!';

switch ($action) {

    // retrieve data
    case 'get':
        //echo file_get_contents('data.txt');
        echo htmlentities($data);
        break;

    // save data
    case 'save':
        if ($value != '') {
            // $fp = fopen('data.txt','w');
            // fwrite($fp, $value);
            // fclose($fp);
            $_SESSION['data'] = $value;
            echo "OK";
        } else {
            echo "ERROR: no value received.";
        }
        break;

    // no action
    default:
        echo "ERROR: no action specified.";
        break;
}