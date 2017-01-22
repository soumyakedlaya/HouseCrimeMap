$(document).ready(function(){
//alert('You are now working with jQuery!');
  $(window).load(function() {

    //DEFINE ALL GLOBAL VARIABLES
    var gAssaultStr = "ASSAULT"
    var gAssaultPng = "/static/project/images/crime/ASSAULT.png"
    var gSexOffensesStr = "SEX OFFENSES, FORCIBLE"
    var gSexOffensesPng = "/static/project/images/crime/SEX OFFENSES, FORCIBLE.png"
    var gKidnappingStr = "KIDNAPPING"
    var gKidnappingPng = "/static/project/images/crime/KIDNAPPING.png"
    var gArsonStr = "ARSON"
    var gArsonPng = "/static/project/images/crime/ARSON.png"
    var gUrlPathPrefix = "https://data.sfgov.org/resource/cuks-n6tp.json?category="
    var gLimitCount = "&$limit=100"
    var gUrl;
    var gCrimeMarkers = [];
    var gPrevInfoWindow;
    var gHomePng = "/static/project/images/housing/house.png"
    var gCondoPng = "/static/project/images/housing/condo.png"
    var gRentPng = "/static/project/images/housing/rent.png"
    var gHousingMarkers = [];

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
      function displayCrimeMarker(catToFilterData, imagePngName) {
        setUp_gUrl(catToFilterData);

        $.getJSON(gUrl, function(data, textstatus) {
          // console.log("In getJSON")
              //########## INITIALIZE INFO WINDOW ###############
              var infowindow = new google.maps.InfoWindow({
                content: ''
              })
              //########## END INITIALIZE INFO WINDOW ###############
              $.each(data, function(index,value) {
                // console.log("In Each")
                // console.log(data)
                  var marker = new google.maps.Marker({
                      position: new google.maps.LatLng(value.y, value.x),
                      map: map,
                      icon: imagePngName,
                      visible: true,
                      content: value
                  });
                  gCrimeMarkers.push(marker);

                  //##################### INFO WINDOW FOR EACH MARKER ###############
                  marker.addListener('click', function(){
                    if (gPrevInfoWindow){
                      gPrevInfoWindow.close();
                    }
                      infowindow.setContent("<p>" + "Record description: " + contentString + "<br />" + " Category: " + objectCat + "</p>");

                      infowindow.open(map, marker);
                      gPrevInfoWindow = infowindow;
                  });

                  var contentString = marker.content.descript;
                  var objectCat = marker.content.category;

              });//end each
        });//end JSON
      }//end displayCrimeMarker

    //##################### CLICK CHECKBOX TO SELECT VARIOUS CRIME CATEGORIES #################

      $('#assault').click(function(){
         if($('#assault').is(':checked')){
           displayCrimeMarker(gAssaultStr, gAssaultPng);
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
         });
       }
     });

     $('#sexoffense').click(function(){
        if($('#sexoffense').is(':checked')){
          displayCrimeMarker(gSexOffensesStr, gSexOffensesPng);
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
        });
      }
    });

    $('#kidnapping').click(function(){
       if($('#kidnapping').is(':checked')){
         displayCrimeMarker(gKidnappingStr, gKidnappingPng);
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
         });
       }
   });

   $('#arson').click(function(){
      if($('#arson').is(':checked')){
        displayCrimeMarker(gArsonStr, gArsonPng);
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
      });
    }
  });

    //################################ HOUSING DATA #################################
    //used an online converter (http://codebeautify.org/csv-to-xml-json) to convert .csv files to .json. Saved as static data in app.

    // function displayHousingMarker(imagePngName) {
    //   var path = "/apps/project/templates/project/home.json";
    //
    //   $.getJSON(path, function(data, textstatus) {
    //     // console.log("In getJSON")
    //         //########## INITIALIZE INFO WINDOW ###############
    //         var infowindow = new google.maps.InfoWindow({
    //           content: ''
    //         })
    //         //########## END INITIALIZE INFO WINDOW ###############
    //         $.each(data, function(index,value) {
    //           // console.log("In Each")
    //           // console.log(data)
    //             var marker = new google.maps.Marker({
    //                 position: new google.maps.LatLng(value.x, value.y),
    //                 map: map,
    //                 icon: imagePngName,
    //                 visible: true,
    //                 content: value
    //             });
    //             gHousingMarkers.push(marker);
    //
    //             //##################### INFO WINDOW FOR EACH MARKER ###############
    //             marker.addListener('click', function(){
    //               if (gPrevInfoWindow){
    //                 gPrevInfoWindow.close();
    //               }
    //                 infowindow.setContent("Address: " + contentString);
    //
    //                 infowindow.open(map, marker);
    //                 gPrevInfoWindow = infowindow;
    //             });
    //
    //             var contentString = marker.content.Address;
    //             // var objectCat = marker.content.category;
    //
    //         });//end each
    //   });//end JSON
    // }//end displayHousingMarker

    function displayHomeMarker(imagePngName, houseCategory) {

      $.get("home", function(res) {
            //########## INITIALIZE INFO WINDOW ###############
            var infowindow = new google.maps.InfoWindow({
              content: ''
            })
            //############# MAP MARKER FOR EACH DATA OBJECT #############
            $.each(JSON.parse(res), function(index,value) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(value.x, value.y),
                    map: map,
                    icon: imagePngName,
                    visible: true,
                    content: value,
                    category: houseCategory
                });
                gHousingMarkers.push(marker);
                //##################### INFO WINDOW FOR EACH MARKER ###############
                marker.addListener('click', function(){
                  if (gPrevInfoWindow){
                    gPrevInfoWindow.close();
                  }
                    infowindow.setContent("<p>" + "Address: " + address + "<br />" + "Price: " + price + "<br />" + "# of Bedrooms: " + bd + "<br />" + "# of Bathrooms: " + ba + "<br />" + "Category: " + objectCat + "</p");

                    infowindow.open(map, marker);
                    gPrevInfoWindow = infowindow;
                });

                var address = marker.content.Address;
                var price = marker.content.Price;
                var bd = marker.content.BD;
                var ba = marker.content.BA;
                var objectCat = marker.category;
            });//end each
            console.log("gHousingMarker without filtering: ", gHousingMarkers.length)




      });//end $get

    }//end displayHomeMarker

    function displayCondoMarker(imagePngName, houseCategory) {

      $.get("condo", function(res) {
        //########## INITIALIZE INFO WINDOW ###############
        var infowindow = new google.maps.InfoWindow({
          content: ''
        })
        //############# MAP MARKER FOR EACH DATA OBJECT #############
        $.each(JSON.parse(res), function(index,value) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(value.x, value.y),
                map: map,
                icon: imagePngName,
                visible: true,
                content: value,
                category: houseCategory
            });
            gHousingMarkers.push(marker);

            //##################### INFO WINDOW FOR EACH MARKER ###############
            marker.addListener('click', function(){
              if (gPrevInfoWindow){
                gPrevInfoWindow.close();
              }

              infowindow.setContent("<p>" + "Address: " + address + "<br />" + "Price: " + price + "<br />" + "# of Bedrooms: " + bd + "<br />" + "# of Bathrooms: " + ba + "<br />" + "Category: " + objectCat + "</p");

              infowindow.open(map, marker);
              gPrevInfoWindow = infowindow;
            });

            var address = marker.content.Address;
            var price = marker.content.Price;
            var bd = marker.content.BD;
            var ba = marker.content.BA;
            var objectCat = marker.category;

            });//end each
      });//end $get
    }//end displayCondoMarker

    function displayRentMarker(imagePngName, houseCategory) {

      $.get("rent", function(res) {
        //########## INITIALIZE INFO WINDOW ###############
        var infowindow = new google.maps.InfoWindow({
          content: ''
        })
        //############# MAP MARKER FOR EACH DATA OBJECT #############
        $.each(JSON.parse(res), function(index,value) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(value.x, value.y),
                map: map,
                icon: imagePngName,
                visible: true,
                content: value,
                category: houseCategory
            });
            gHousingMarkers.push(marker);

            //##################### INFO WINDOW FOR EACH MARKER ###############
            marker.addListener('click', function(){
              if (gPrevInfoWindow){
                gPrevInfoWindow.close();
              }
              infowindow.setContent("<p>" + "Address: " + address + "<br />" + "Price: " + price + "<br />" + "# of Bedrooms: " + bd + "<br />" + "# of Bathrooms: " + ba + "<br />" + "Category: " + objectCat + "</p");

              infowindow.open(map, marker);
              gPrevInfoWindow = infowindow;
            });

            var address = marker.content.Address;
            var price = marker.content.Price;
            var bd = marker.content.BD;
            var ba = marker.content.BA;
            var objectCat = marker.category;

            });//end each
      });//end $get
    }//end displayRentMarker



    $('#home').click(function(){
       if($('#home').is(':checked')){
         displayHomeMarker(gHomePng, "Single Family Home");
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
          displayCondoMarker(gCondoPng, "Condo");
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
           displayRentMarker(gRentPng, "Rental");
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

     $('#filterprice').click(function(){

       var minprice = $('#minprice').val();
       minprice = parseInt(minprice); //parseInt converts string to integer

       var maxprice = $('#maxprice').val();
       maxprice = parseInt(maxprice);

       $.each(gHousingMarkers, function(index, value){
         var price = value.content.Price
         price = price.replace(/,/g, "");
         price = price.replace('/', ""); //replaces all / in number with empty string
         price = price.replace('$', ""); //replaces all $ in number with empty string
         price = price.replace('/mo', "");
         price = parseInt(price); //converts string to integer

         if(price < minprice || price > maxprice ){
           value.setVisible(false);
         }
       });
     })









 }); //end of window.load function
}); //end of document.ready function
