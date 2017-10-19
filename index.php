<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="manifest" href="site.webmanifest">
        <link rel="apple-touch-icon" href="icon.png">
        <!-- Place favicon.ico in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
    </head>
    <body>
        <!--[if lte IE 9]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
        <![endif]-->

        <div class="jumbotron">
          <h1>Fast Track Auction Scraper</h1>
          <h5>There are <span class="js-auction-count">no</span> auctions cached<span class="js-auction-current-location"></span>.</h5>
          <hr>
          <div class="">
            <div class="form-group">
              <label for="auction-name">Auction Location:</label>
              <select class="js-auction-name" name="auction-name" id="auction-name">
                <option value="">Please select</option>
              </select>
              <button type="button" class="js-update btn btn-primary">Fetch & Cache</button>
            </div>
          </div>
          <div class="">
            <div class="form-group">
              <label for="auction-filter">Filter:</label>
              <input type="text" class="js-auction-filter" name="auction-filter" id="auction-filter">
              <button type="button" class="js-filter btn btn-success">Apply</button>
              <button type="button" class="js-remove-filter btn btn-danger">Remove</button>
            </div>
          </div>
        </div>
        <div class="container">
          <ul class="auction-list"></ul>
        </div>
        <script src="js/vendor/modernizr-3.5.0.min.js"></script>
        <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-3.2.1.min.js"><\/script>')</script>

  <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>

    </body>
</html>
