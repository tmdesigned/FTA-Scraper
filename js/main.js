
var auctions;
var locations;

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
            updateList();
         },
         'error' : function(request,error)
         {
             alert("Request: "+JSON.stringify(request));
         }
     });
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
      var auctionString = '<li class="auction-item"><a target="_blank" href="'+auctions[i]['url']+'">'+auctions[i]['id']+'</a>';
      auctionString += '<ol>';
      for(var j=0;j<auctions[i]['items'].length;j++){
        auctionString += '<li><a target="_blank" href="' + auctions[i]['items'][j]['url'] + '">' + auctions[i]['items'][j]['description'] + '</a></li>';
      }
      auctionString += '</ol></li>';
      $('.auction-list').append(auctionString);

    }
  }
