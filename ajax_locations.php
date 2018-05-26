<?php

$url = 'http://bidfta.bidqt.com/BidFTA/services/invoices/queryExecutor/queries/FTALocations?size=100';

//CURL request
$ch = curl_init();
           curl_setopt($ch, CURLOPT_URL, $url);
           curl_setopt($ch, CURLOPT_HEADER, FALSE);

           curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
           curl_setopt($ch,CURLOPT_HTTPHEADER,array('Origin: http://bidfta.bidqt.com','Referer: http://bidfta.bidqt.com','X-Requested-With: XMLHttpRequest'));
           $head = curl_exec($ch);
           $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
           curl_close($ch);

echo $head;

 ?>
