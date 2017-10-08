var options = {
//  include: ["matches"],
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  tokenize: true,
  matchAllTokens: true,
  distance: 50,
  maxPatternLength: 50,
  minMatchCharLength: 1,
  keys: [
    "title",
    "content",
    "tags"
  ]
 };
 var fuse;
 function processData (data) {
   fuse = new Fuse(data, options);
 }
 (function() {
   var API = "/search_data.json";
   $.getJSON(API)
    .done(processData);
 })();

$('#search-box').on('input', function(e) {
   e.preventDefault();
   var result = fuse.search($('#search-box').val());
   $("#search-results").empty();
   result.map(function (item) {
     $("#search-results").append("<div class=\"result-item\"><a class=\"result-item-title\" href=\"" + item.url + "\">" + item.title + "</a></div>");
  });
  // result.map(function (obj) {
  //   var titlestring = obj.item.title;
  //   obj.matches.map(function (match) {
  //     if (match.key == "title") {
        
  //     }
  //   });
  //    $("#search-results").append("<div class=\"result-item\"><a class=\"result-item-title\" href=\"" + item.url + "\">" + item.title + "</a></div>");
  //  });
  
});

$('#search').submit(function(e) {
   e.preventDefault();
 });
