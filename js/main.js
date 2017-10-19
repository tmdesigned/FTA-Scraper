
var auctions;
var locations;

$('body').on('click','.js-filter',function(){
  showAllItems();
  showAllAuctions();
  filter($('.js-auction-filter').val());
  removeEmptyAuctions();
});

$('body').on('click','.js-remove-filter',function(){
  showAllItems();
});

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

  $(document).ready(function(){
    showLoading();
    getLocations();
    getDefault();



  });

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

  function updateCurrentLocation(){
    if(auctions.length > 0){
      var thisLocation = auctions[0]['location'];
      $('.js-auction-current-location').text(' from the '+thisLocation+' location');
    }else{
      $('.js-auction-current-location').text('');
    }
  }

  function updateLocations(){
    var locationsContent = locations["content"];
    for(var i=0;i<locationsContent.length;i++){
      $('#auction-name').append('<option value="'+locationsContent[i]["ftalocationName"]+'">'+locationsContent[i]["ftalocationName"]+'</option>');;
    }
  }

  function updateCounts(){
    $('.js-auction-count').text(auctions.length);
  }

  function showLoading(){
    $('.auction-list').html('<em>Loading...</em>');
  }

  function updateList(){
    $('.auction-list').empty();

    for(var i=0;i<auctions.length;i++){
      var date = new Date(auctions[i]['end_datetime']);
      var friendlyDate = date.toLocaleDateString() + ' - ' + date.toLocaleTimeString();
      var auctionString = '<li class="auction-item"><div class="auction-header"><a target="_blank" href="'+auctions[i]['url']+'">Auction #'+auctions[i]['id']+'</a> <span class="end-date">Ends: '+friendlyDate+'</span></div>';
      auctionString += '<ol class="row">';
      for(var j=0;j<auctions[i]['items'].length;j++){
        //<img class="card-img-top" src="'+auctions[i]['items'][j]['photo_url']+'">
        auctionString += '<li class="col-xs-12 col-sm-6 col-md-3"><div class="card"><div class="card-body"><a class="card-title" target="_blank" href="' + auctions[i]['items'][j]['url'] + '">' + auctions[i]['items'][j]['description'] + '</a><br /><span class="condition">' + auctions[i]['items'][j]['condition'] + '</span></div></div></li>';
      }
      auctionString += '</ol></li>';
      $('.auction-list').append(auctionString);

    }
  }

  function showAllItems(){
    $('.auction-item li').show();
  }

  function showAllAuctions(){
    $('.auction-item').show();
  }

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
