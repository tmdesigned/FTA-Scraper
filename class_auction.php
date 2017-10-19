<?php
	class auction implements JsonSerializable{
    private $id;
    private $url;
		private $location;
    private $end_datetime;
		private $base_name;
    private $items = array();

    function __construct($id) {
    			$this->id = $id;
    }

		public function jsonSerialize(){
		 $json = array();
		 foreach($this as $key => $value) {
				 $json[$key] = $value;
		 }
		 return $json; // or json_encode($json)
	 }

	 function DOMinnerHTML($element)
		{
		    $innerHTML = "";
		    $children  = $element->childNodes;

		    foreach ($children as $child)
		    {
		        $innerHTML .= $element->ownerDocument->saveHTML($child);
		    }

		    return $innerHTML;
		}

    function scrape(){

			//Create PHP dom document, pull each <tr> within the DataTable table into a row
      libxml_use_internal_errors(true);
      $doc = new DOMDocument();
      $doc->loadHTML(file_get_contents($this->url));
      $data_table = $doc->getElementById('DataTable');
      $rows = $data_table->getElementsByTagName('tr');

			//Loop through each row
      foreach ($rows as $row){

					//Create a new "item", first column is the item id, second is all the data
          $cols = $row->getElementsByTagName('td');
					$item_id = str_replace('.','',$cols[0]->textContent);
          $output_item = new item($item_id);

					//Parse through item data (second column) to find description and cnodition
          $raw_description = $this->DOMinnerHTML($cols[1]);
          $success = preg_match("/Desc.*?<\/b>:\s*(.*?)<br>/",$raw_description,$description);
          $output_item->set_description($description[1]);

          preg_match("/Info.*?<\/b>:\s*(.*?)<br>/",$raw_description,$condition);

					//Condition isn't always given
					if(count($condition) < 2){
            $output_item->set_condition("");
          }else{
            $output_item->set_condition($condition[1]);
          }

					$output_item->set_photo_url('http://d2c3kiufvhjdfg.cloudfront.net/Pics/'.$item_id.'t.jpg');

					//Compute the item URL
					//   base url + auction base name + auction id + / + item id
					//   i.e. https://bid.bidfta.com/cgi-bin/mnlist.cgi?schooliii1281/HQ792094
					$output_item->set_url('https://bid.bidfta.com/cgi-bin/mnlist.cgi?' . $this->base_name . $this->id . '/' . $item_id);

					//If description was pulled, push the item into the auction's array of items
          if($success){
            array_push($this->items, $output_item);
          }
      }
    }

    function get_id(){
      return $this->id;
    }

    function add_item($item) {
			$this->items[] = $item;
		}

		function get_items() {
			return $this->items;
		}

    function set_end_datetime($end_datetime){
      $this->end_datetime = $end_datetime;
    }

    function get_end_datetime(){
      return $this->end_datetime;
    }

    function set_url($url){
      $this->url = $url;
    }

    function get_url(){
      return $this->url;
    }

		function set_base_name($base_name){
      $this->base_name = $base_name;
    }

    function get_base_name(){
      return $this->base_name;
    }

		function set_location($location){
			$this->location = $location;
		}

		function get_location(){
			return $this->location;
		}
	}
?>
