<?php

include("class_auction.php");
include("class_item.php");

class scraper implements JsonSerializable{

	private $search_term;
	private $auctions = array();

	function __construct($search_term){
		$this->search_term = $search_term;
	}

	function get_auctions(){
		return $this->auctions;
	}

	function dump_auctions(){
		echo json_encode($this->auctions);
	}

	function restore_session(){
		if(isset($_SESSION['auctions'])){
			$this->auctions = $_SESSION['auctions'];
		}
	}

	function save_session(){
	  $_SESSION['auctions'] = $this->auctions;
	}

	function scrape_all_auctions(){
		foreach ($this->auctions as $auction){
			$auction->scrape();
		}
	}

	 public function jsonSerialize(){
		$json = array();
		foreach($this as $key => $value) {
				$json[$key] = $value;
		}
		return $json; // or json_encode($json)
	}


	/*
	*  Function fetch_auctions
	*  -----------------------
	*  Fetches list of auctions, filters by search term, and returns array of matching PRINT url's
	*  for those auctions.
	*  Input: search term (auction location name, exact)
	*  Output: array of print list URLs
	*/
	function fetch_auctions(){
		//Base URL
		$url = 'http://bidfta.bidqt.com/BidFTA/services/invoices/WlAuctions/filter?page=1&size=1000&sort=endDateTime%20asc';

		//POST data to send
		$fields = array(
			'q' => 'showTimeRemaining=0'
		);

		$fields_string = '';

		//Encode POST values
		foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
		rtrim($fields_string, '&');

		//CURL request
		$ch = curl_init();
		           curl_setopt($ch, CURLOPT_URL, $url);
		           curl_setopt($ch, CURLOPT_HEADER, FALSE);
		           curl_setopt($ch,CURLOPT_POST, count($fields));
		           curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
		          //  curl_setopt($ch, CURLOPT_NOBODY, TRUE); // remove body
		           curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		           curl_setopt($ch,CURLOPT_HTTPHEADER,array('Origin: http://bidfta.bidqt.com','Referer: http://bidfta.bidqt.com','X-Requested-With: XMLHttpRequest'));
		           $head = curl_exec($ch);
		           $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		           curl_close($ch);

		$result = json_decode($head);

		//List of all auctions
		$auction_list = $result->content;

		foreach ($auction_list as $auction){
			//If matching search term, add to matching auctions
		  if($auction->ftalocationName == $this->search_term){
				$auction_number = $auction->auctionNumber;
				$auction_print = str_replace('mnlist','mnprint',$auction->auctionUrl);
				$auction_url = $auction_print . $auction_number;
				$auction_base_name = str_replace('https://bid.bidfta.com/cgi-bin/mnlist.cgi?','',$auction->auctionUrl);
				$auction_date = $auction->endDateTime;

				$output_auction = new auction($auction_number);
				$output_auction->set_end_datetime($auction_date);
				$output_auction->set_url($auction_url);
				$output_auction->set_base_name($auction_base_name);
				$output_auction->set_location($this->search_term);

				array_push($this->auctions,$output_auction);
			}
		}

	}

}
?>
