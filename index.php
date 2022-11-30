<?php

if(isset($_POST['post_jsondata']))
{
    $data_file = fopen('data/data.json', 'w');

    fwrite($data_file, $_POST['post_jsondata']);

    fclose($data_file);
}

if(isset($_POST['new_request']))
{
    $data_file = fopen('data/request.txt', 'w');

    fwrite($data_file, $_POST['new_request']);

    fclose($data_file);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--jQuery import-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

    <!--WebGazer import-->
    <script src="js/webgazer.js" type="text/javascript" ></script>

    <!-- Custom Stylesheet-->
    <link rel="stylesheet" href="css/main.css">

    <!--Main JS Call-->
    <script src="js/main.js"></script>

    <title>Astérisque</title>
</head>
<body>

    <div class="calibration_layout">
        <h1 id="calibration_msg">Click on each point 5 times to calibrate the eye tracking, alternate between each point.</h1>
        <input type="button" class="calibration_buttons" id="Pt1"></input>
        <!-- <input type="button" class="calibration_buttons" id="Pt2"></input>
        <input type="button" class="calibration_buttons" id="Pt3"></input>
        <input type="button" class="calibration_buttons" id="Pt4"></input>
        <input type="button" class="calibration_buttons" id="Pt5"></input>
        <input type="button" class="calibration_buttons" id="Pt6"></input>
        <input type="button" class="calibration_buttons" id="Pt7"></input>
        <input type="button" class="calibration_buttons" id="Pt8"></input> -->
        <input type="button" class="calibration_buttons" id="Pt9"></input>
    </div>

    <div class="map_layout">
        <h1 id="title">Welcome to Astérisque *</h1>
        <h2 id="build_map">Click here to start building your map</h2>
        <canvas id="map" ></canvas>
    </div>

    <iframe id="stream" src="assets/prototype_plotter.mp4" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" sandbox></iframe>    
</body>
</html>