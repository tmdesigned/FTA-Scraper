<?php
	class item implements JsonSerializable{
    private $id;
    private $description;
		private $condition;
		private $url;

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

    function get_id(){
      return $this->id;
    }

    function set_description($description){
			$this->description = $description;
		}

		function get_description(){
			return $this->description;
		}

		function set_condition($condition){
			$this->condition = $condition;
		}

		function get_condition(){
			return $this->condition;
		}

		function set_url($url){
			$this->url = $url;
		}

		function get_url(){
			return $this->url;
		}
	}
?>
