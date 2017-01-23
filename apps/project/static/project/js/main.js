$(document).ready(function(){ // executes when HTML-Document is loaded and DOM is ready
  //alert('You are now working with jQuery!');

  $(window).load(function() {  // executes when complete page is fully loaded, including all frames, objects and images

    //DEFINE ALL GLOBAL VARIABLES
    var gAssaultStr = "ASSAULT"
    var gAssaultPng = "/static/project/images/crime/ASSAULT.png"
    var gSexOffensesStr = "SEX OFFENSES, FORCIBLE"
    var gSexOffensesPng = "/static/project/images/crime/SEX OFFENSES, FORCIBLE.png"
    var gKidnappingStr = "KIDNAPPING"
    var gKidnappingPng = "/static/project/images/crime/KIDNAPPING.png"
    var gArsonStr = "ARSON"
    var gArsonPng = "/static/project/images/crime/ARSON.png"
    var gCrimeString = ""
    var gCrimeImagePng = ""
    var gUrlPathPrefix = "https://data.sfgov.org/resource/cuks-n6tp.json?category="
    var gLimitCount = "&$limit=100"
    var gUrl;
    var gCrimeMarkers = [];
    var gResidenceUrlString = "";
    gResidenceImagePng = "";
    var gHomePng = "/static/project/images/housing/house.png"
    var gCondoPng = "/static/project/images/housing/condo.png"
    var gRentPng = "/static/project/images/housing/rent.png"
    var gHousingMarkers = [];
    var gPrevInfoWindow;

    //set up url for external data.gov.
    function setUp_gUrl(catToFilterData) {
      gUrl = gUrlPathPrefix + encodeURIComponent(catToFilterData) + gLimitCount;
    }

    //########################## INITIALIZE MAP ########################
      var center = new google.maps.LatLng(37.7749,-122.4194); //SF coordinates
      var mapOptions = {
        zoom: 12,
        center: center,
        mapTypeId: 'terrain'
      }
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //################## MAP SEARCH BOX  ############################

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
       map.addListener('bounds_changed', function() {
         searchBox.setBounds(map.getBounds());
       });
       var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }
        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            // icon: icon,
            animation: google.maps.Animation.DROP,
            title: place.name,
            position: place.geometry.location,
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }

        });
        map.fitBounds(bounds);
      });

      //###################DISPLAY CRIME MARKERS ON MAP ##############
      function displayCrimeMarker() {
        setUp_gUrl(gCrimeString);

        $.getJSON(gUrl, function(data, textstatus) {
          // console.log("In getJSON")
              //Initialize Info Window
              var infowindow = new google.maps.InfoWindow({
                content: ''
              })
              //For each JSON object in data, create a marker
              $.each(data, function(index,value) {
                // console.log("Data: ", data)
                  var marker = new google.maps.Marker({
                      position: new google.maps.LatLng(value.y, value.x),
                      map: map,
                      icon: gCrimeImagePng,
                      visible: true,
                      content: value
                  });
                  gCrimeMarkers.push(marker); //push marker into a global array of all the CrimeMarkers

                  //INFO WINDOW FOR EACH MARKER
                  marker.addListener('click', function(){
                    //close a previous window if there is one open
                    if (gPrevInfoWindow){
                      gPrevInfoWindow.close();
                    }

                    //set content to infowindow
                    var contentString = marker.content.descript;
                    var objectCat = marker.content.category;

                    infowindow.setContent("<p>" + "Record description: " + contentString + "<br />" + " Category: " + objectCat + "</p>");

                    //open infowindow
                    infowindow.open(map, marker);

                    //store current infowindow in global previous Info window for the next marker that is clicked
                    gPrevInfoWindow = infowindow;
                  });
              });//end .each
        });//end .getJSON
      }//end displayCrimeMarker

    //##################### CLICK CHECKBOX TO SELECT VARIOUS CRIME CATEGORIES #################

      $('#assault').click(function(){
         if($('#assault').is(':checked')){
           gCrimeString = gAssaultStr;
           gCrimeImagePng = gAssaultPng;
           displayCrimeMarker();
         }
         else{
           $.each(gCrimeMarkers, function(index, value){
             if(value.icon.includes("ASSAULT")){
               value.setVisible(false);
             }
             if(gPrevInfoWindow){
               if(gPrevInfoWindow.content.includes("ASSAULT")){
                 gPrevInfoWindow.close();
               }
             }
         }); //end .each
       } //end else
     });

     $('#sexoffense').click(function(){
        if($('#sexoffense').is(':checked')){
          gCrimeString = gSexOffensesStr;
          gCrimeImagePng = gSexOffensesPng;
          displayCrimeMarker();
        }
        else{
          $.each(gCrimeMarkers, function(index, value){
            if(value.icon.includes("SEX OFFENSES, FORCIBLE.png")){
              value.setVisible(false);
            }
            if(gPrevInfoWindow){
              if(gPrevInfoWindow.content.includes("SEX OFFENSES, FORCIBLE")){
                gPrevInfoWindow.close();
              }
            }
        }); //end .each
      } //end else
    });

    $('#kidnapping').click(function(){
       if($('#kidnapping').is(':checked')){
         gCrimeString = gKidnappingStr;
         gCrimeImagePng = gKidnappingPng;
         displayCrimeMarker();
       }
       else{
         $.each(gCrimeMarkers, function(index, value){
           if(value.icon.includes("KIDNAPPING.png")){
             value.setVisible(false);
           }
           if(gPrevInfoWindow){
             if(gPrevInfoWindow.content.includes("KIDNAPPING")){
               gPrevInfoWindow.close();
             }
           }
         }); //end .each
       } //end else
   });

   $('#arson').click(function(){
      if($('#arson').is(':checked')){
        gCrimeString = gArsonStr;
        gCrimeImagePng = gArsonPng;
        displayCrimeMarker();
      }
      else{
        $.each(gCrimeMarkers, function(index, value){
          if(value.icon.includes("ARSON.png")){
            value.setVisible(false);
          }
          if(gPrevInfoWindow){
            if(gPrevInfoWindow.content.includes("ARSON")){
              gPrevInfoWindow.close();
            }
          }
      }); //end .each
    } //end else
  });

    //################################ HOUSING DATA #################################
    //used an online converter (http://codebeautify.org/csv-to-xml-json) to convert .csv files to .json. Saved as static data in app.

    //Display Residence markers on map
    function displayResidenceMarker(residenceCategory) {

      $.get(gResidenceUrlString, function(res) {
            //initialize Info Window
            var infowindow = new google.maps.InfoWindow({
              content: ''
            })
            //for each JSON object in data, create a MARKERS
            $.each(JSON.parse(res), function(index,value) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(value.x, value.y),
                    map: map,
                    icon: gResidenceImagePng,
                    visible: true,
                    content: value,
                    category: residenceCategory
                });
                gHousingMarkers.push(marker); //push marker into global array of all the HousingMarkers

                //INFO WINDOW FOR EACH MARKER
                marker.addListener('click', function(){
                  //close a previous window if there is one open
                  if (gPrevInfoWindow){
                    gPrevInfoWindow.close();
                  }

                  //set content to infowindow
                  var address = marker.content.Address;
                  var price = marker.content.Price;
                  var bd = marker.content.BD;
                  var ba = marker.content.BA;
                  var objectCat = marker.category;

                  infowindow.setContent("<p>" + "Address: " + address + "<br />" + "Price: " + price + "<br />" + "# of Bedrooms: " + bd + "<br />" + "# of Bathrooms: " + ba + "<br />" + "Category: " + objectCat + "</p");

                  //open infowindow
                  infowindow.open(map, marker);

                  //store current infowindow in global previous Info window for the next marker that is clicked
                  gPrevInfoWindow = infowindow;
                });
            });//end each
            // console.log("gHousingMarker without filtering: ", gHousingMarkers.length)
      });//end $get
    }//end displayResidenceMarker

  //##################### CLICK CHECKBOX TO SELECT VARIOUS HOUSING CATEGORIES #################

    $('#home').click(function(){
       if($('#home').is(':checked')){
         gResidenceUrlString = "home";
         gResidenceImagePng = gHomePng;
         displayResidenceMarker("Single Family Home");
       }
       else{
         $.each(gHousingMarkers, function(index, value){
           if(value.icon.includes("house.png")){
             value.setVisible(false);
           }
           if(gPrevInfoWindow){
             if(gPrevInfoWindow.content.includes("Home")){
               gPrevInfoWindow.close();
             }
           }
         }); //end each
      }
    });//END home.click

     $('#condo').click(function(){
        if($('#condo').is(':checked')){
          gResidenceUrlString = "condo";
          gResidenceImagePng = gCondoPng;
          displayResidenceMarker("Condo");
        }
        else{
          $.each(gHousingMarkers, function(index, value){
            if(value.icon.includes("condo.png")){
              value.setVisible(false);
            }
            if(gPrevInfoWindow){
              if(gPrevInfoWindow.content.includes("Condo")){
                gPrevInfoWindow.close();
              }
            }
        });
      }
    });

      $('#rent').click(function(){
         if($('#rent').is(':checked')){
           gResidenceUrlString = "rent";
           gResidenceImagePng = gRentPng;
           displayResidenceMarker("Rental");
         }
         else{
           $.each(gHousingMarkers, function(index, value){
             if(value.icon.includes("rent.png")){
               value.setVisible(false);
             }
             if(gPrevInfoWindow){
               if(gPrevInfoWindow.content.includes("Rent")){
                 gPrevInfoWindow.close();
               }
             }
         });
       }
     });

     //PRICE RANGE FILTER
     $('#filterprice').click(function(){

       var minprice = $('#minprice').val();
       minprice = parseInt(minprice); //parseInt converts string to integer

       var maxprice = $('#maxprice').val();
       maxprice = parseInt(maxprice);

       $.each(gHousingMarkers, function(index, value){
         var price = value.content.Price;
         price = price.replace(/,/g, "");
        //  price = price.replace('/', ""); //replaces all / in number from data  with empty string
         price = price.replace('$', ""); //replaces $ in number from data with empty string
         price = price.replace('/mo', ""); //replaces /mo in number from data with empty string
         price = parseInt(price); //converts string to integer

         //if the price is out of the price range user inputs, set visibility to false
         if(price < minprice || price > maxprice ){
           value.setVisible(false);
         }
       });
     })
 }); //end of window.load function
}); //end of document.ready function
