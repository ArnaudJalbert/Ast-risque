<?php

    if(isset($_GET['get_undrawn_entry']))
    {
        require('set_up_db.php');

        $undrawn_query = "SELECT * FROM map_entries WHERE drawn=0 LIMIT 1";

        $response = $file_db->query($undrawn_query);
        
        if(!$response) die("Cannot execute query.");

        $map_data = $response->fetch(PDO::FETCH_ASSOC);

        if($map_data && count($map_data) > 0){
            
            $time_id = $map_data['time_stamp'];

            $update = "UPDATE map_entries SET drawn=1 WHERE time_stamp=".$time_id;

            $file_db->exec($update);

            echo $map_data['map_data'];

        
        }else{
            echo "empty";
        }



    }

?>


