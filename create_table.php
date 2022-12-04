<?php

    require('set_up_db.php');

    try
    {
        $tableQuery = "CREATE TABLE IF NOT EXISTS map_entries (time_stamp INTEGER PRIMARY KEY NOT NULL, username TEXT, map_data TEXT,  drawn INT)";
        $file_db ->exec($tableQuery);
        echo ("Table map_entries created successfully<br>");
        $file_db = null;
    }
    catch(PDOException $e) 
    {
        // Print PDOException message
        echo $e->getMessage();
    }
?>