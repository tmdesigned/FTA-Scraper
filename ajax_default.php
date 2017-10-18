<?php

include("class_scraper.php");

session_start();

$default_scrape = new scraper("");
$default_scrape->restore_session();
$default_scrape->dump_auctions();

session_write_close();
