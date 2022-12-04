<?php

if(isset($_POST['insert_map_entry']))
{
    require('set_up_db.php');

    // $_POST['insert_map_entry'] is a string of form (time_stamp, username, data, drawn)
    $entry_query = "INSERT INTO map_entries (time_stamp, username, map_data,  drawn) VALUES " . $_POST['insert_map_entry'];

    try{
        # entering into table
        $file_db->exec($entry_query);
        echo "Entered in db!";
    }
    catch(PDOException $e) {
        // Print PDOException message
         echo $e->getMessage();
    }
}

?>