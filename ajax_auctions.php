<?php

include("class_scraper.php");

if(!isset($_GET['q'])){
  exit(0);
}

session_start();

$school_road = new scraper($_GET['q']);
$school_road->fetch_auctions();
$school_road->scrape_all_auctions();
$school_road->save_session();
$school_road->dump_auctions();

session_write_close();



 ?>
