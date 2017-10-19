(function(){

var auctions;
var locations;

$(document).ready(function(){
  showLoading();
  getLocations();
  getDefault();
});

/* LISTENERS */

//Filter/search button clicked
$('body').on('click','.js-filter',function(){
  showAllItems();
  showAllAuctions();
  filter($('.js-auction-filter').val());
  removeEmptyAuctions();
  updateSearchHeaderText();
});

//Filter reset clicked
$('body').on('click','.js-remove-filter',function(){
  showAllItems();
  $('.js-results-header').empty();
});

//Show related image clicked (not by default for bandwidth)
$('body').on('click','.js-show-button',function(){
  var imageElement = $(this).parent().parent().parent().find('.card-img-top');
  imageElement.prop('src',imageElement.data('src')).removeClass('hidden');
  $(this).remove();
});

//Fetch and Cache results clicked
$('body').on('click','.js-update',function(){
  var auctionName = $('#auction-name').val();
  if(auctionName == ""){
    return;
  }
  showLoading();

  $.ajax({

       'url' : 'ajax_auctions.php',
       'type' : 'GET',
       'data' : {
           'q' : auctionName
       },
       'success' : function(data) {
          auctions = JSON.parse(data);
          updateCounts();
          updateCurrentLocation();
          updateList();
       },
       'error' : function(request,error)
       {
           alert("Request: "+JSON.stringify(request));
       }
   });
});

  //Grabs available location choices
  function getLocations(){
    $.ajax({

         'url' : 'ajax_locations.php',
         'type' : 'GET',
         'success' : function(data) {
            locations = JSON.parse(data);
            updateLocations();
         },
         'error' : function(request,error)
         {
             alert("Request: "+JSON.stringify(request)+JSON.stringify(error));

         }
     });
  }

  //Pulls cached results if available
  function getDefault(){
    $.ajax({

         'url' : 'ajax_default.php',
         'type' : 'GET',
         'success' : function(data) {
            auctions = JSON.parse(data);
            updateCounts();
            updateCurrentLocation();
            updateList();
         },
         'error' : function(request,error)
         {
             alert("Request: "+JSON.stringify(request));
         }
     });
  }

  //Updates the header text with current location
  function updateCurrentLocation(){
    if(auctions.length > 0){
      var thisLocation = auctions[0]['location'];
      $('.js-auction-current-location').text(' from the '+thisLocation+' location');
    }else{
      $('.js-auction-current-location').text('');
    }
  }

  //Adds locations to dropdown
  function updateLocations(){
    var locationsContent = locations["content"];
    for(var i=0;i<locationsContent.length;i++){
      $('#auction-name').append('<option value="'+locationsContent[i]["ftalocationName"]+'">'+locationsContent[i]["ftalocationName"]+'</option>');;
    }
  }

  //Updates header text with # auctions
  function updateCounts(){
    $('.js-auction-count').text(auctions.length);
  }

  //Temporary loading screen for fetching results
  function showLoading(){
    $('.auction-list').html('<em>Loading...</em>');
  }

  //Loops through auctions and displays auctions and their items
  function updateList(){
    $('.auction-list').empty();

    for(var i=0;i<auctions.length;i++){
      var date = new Date(auctions[i]['end_datetime']);
      var friendlyDate = date.toLocaleDateString() + ' - ' + date.toLocaleTimeString();
      var auctionString = '<li class="auction-item"><div class="auction-header"><a target="_blank" href="'+auctions[i]['url']+'">Auction #'+auctions[i]['id']+'</a> <span class="end-date">Ends: '+friendlyDate+'</span></div>';
      auctionString += '<ol class="row">';
      for(var j=0;j<auctions[i]['items'].length;j++){
        auctionString += '<li class="col-xs-12 col-sm-6 col-md-3"><div class="card"><img class="card-img-top hidden" data-src="'+auctions[i]['items'][j]['photo_url']+'"><div class="card-body"><a class="card-title" target="_blank" href="' + auctions[i]['items'][j]['url'] + '">' + auctions[i]['items'][j]['description'] + '</a><br /><span class="condition">' + auctions[i]['items'][j]['condition'] + '</span><div><a href="'+auctions[i]['items'][j]['url']+'" class="btn btn-xs btn-success">Open</a><button style="float:right" class="js-show-button btn btn-xs btn-secondary">Load Image</button></div></div></div></li>';
      }
      auctionString += '</ol></li>';
      $('.auction-list').append(auctionString);

    }
  }

  //Unhides filtered items
  function showAllItems(){
    $('.auction-item li').show();
  }

  //Unhides filtered auctions (ones that had 0 results)
  function showAllAuctions(){
    $('.auction-item').show();
  }

  //Hides an auction if no items that aren't filtered out
  function removeEmptyAuctions(){
    $('.auction-item').each(function(){
        //Hide if no li's that aren't display:none
        var items = $(this).find('li');
        var i = 0;
        var anyShown = false;
        while(!anyShown && i < items.length){
          if($(items[i]).css('display') != 'none'){
            anyShown = true;
          }
          i++;
        }
        if(!anyShown){
          $(this).hide();
        }

    });
  }

  //"Search" engine
  //Treats each term separately so that order doesn't matter
  function filter(keywords){
    keywords = keywords.toLowerCase();
    var keywordArray = keywords.split(' ');
    if(keywordArray.length==1 && keywordArray[0].length<2){
      return;
    }

    $('.auction-item .card-title').each(function(){
      var remove = false;
      var i = 0;
      while(!remove && i<keywordArray.length){
        if($(this).text().toLowerCase().indexOf(keywordArray[i]) == -1){
          remove = true;
        }
        i++;
      }
      if(remove) {
        $(this).parent().parent().parent().hide();
      }

    });
  }

  //Writes header of search engine i.e. 3 results for _____
  function updateSearchHeaderText(){
    $('.js-results-header').text(countResults() + ' results for: ' + $('.js-auction-filter').val());
  }

  //Count "Surviving" items i.e. search matches
  function countResults(){
    var count = 0;
    $('.auction-item li').each(function(){
      if($(this).css('display') != "none"){
        count++;
      }
    });
    return count;
  }

})();
