/*  This function is called when script is first loaded,to check
to see if screen size is less than 1024px */
function initialize() {
    var mapOptions;
    if ( $(window).width() < 1024) {
        mapOptions = {
            center: {
                lat: 8.5241,
                lng: 76.9366
            },
            zoom: 10,
            disableDefaultUI: true
        };
    } else {
        mapOptions = {
            center: {
                lat: 8.5241,
                lng: 76.9366
            },
            zoom: 12
        };
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var vm = new viewModel();
    ko.applyBindings(vm);
}




//ViewModel
function viewModel() {
    // variables
    var self = this;

    var map;
    var markers = [];
    var searchQueryfirstLetter;
    var churches;
    var baseURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=";
    var url;
    var infowindow = new google.maps.InfoWindow();
    self.showSearchList = ko.observable(false);
    self.showList = ko.observable(true);
    self.searchQuery = ko.observable();
    self.markerArray = ko.observableArray(new model().churchesOfTvmArray);
    self.searchListArray = ko.observableArray();
    self.listArray = ko.observableArray([]);
    /*  function to show the markers on the view when app is first loaded
        and when self.searchQuery is empty */
    function setupMarkers() {
        for (var i = 0; i < self.markerArray().length; i++) {
            var marker = new google.maps.Marker({
                position: self.markerArray()[i].cords,
                map: map,
                title: self.markerArray()[i].description,
                type: self.markerArray()[i].type,
                wikiPageHeader: self.markerArray()[i].wikiURL,
                wikiText: ""
            });
            markers.push(marker);
            wikipediaDescription(marker);
        }
    }
    //Auto complete search for the search bar
    self.searchQuery.subscribe(function() {
        //return an array from searchModel.autoCompleteSearchArray object in the model.js file
        churches = new searchModel().autoCompleteSearchArray;
        searchQueryfirstLetter = self.searchQuery().charAt(0);
        //hides the auto complete list if the search bar is empty
        if(self.searchQuery().length === 0) {
            self.showSearchList(false);
            self.searchListArray.removeAll();
            self.listArray.removeAll();
            resetMarkers();
            resetList();
            infowindow.close();
        }
        //if conditional statements evaluate true ,shows the search list and auto complete suggestions
        else if(self.searchQuery().length === 1 && self.searchListArray().length === 0) {
            self.showSearchList(true);
            for(var i = 0; i < churches.length; i++) {
                if(searchQueryfirstLetter.toUpperCase() === churches[i].charAt(0)) {
                    self.searchListArray.push(churches[i]);
                }
            }
        }
        // filters auto search for relevant suggestions
        else if(self.searchQuery().length >= 1) {
            var str = "";
            self.showSearchList(true);
            self.searchListArray.removeAll();
            for(var j = 0; j < churches.length; j++) {
                str = churches[j].toLowerCase().substring(0, self.searchQuery().length);
                if(str === self.searchQuery().toLowerCase()) {
                    self.searchListArray.push(churches[j]);
                }
            }
        }
        filterMarkers();
    });

    /*function is called when search items in the auto complete box is clicked.It also hides the
      auto complete box, and fill the search bar with the clicked item and display marker
      relative to search item */

    self.autoCompleteMarkerSelect = function(searchItem) {
        self.searchQuery(searchItem);
        self.showSearchList(false);
        self.listArray.removeAll();
        for(var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
            for(var j in markers[i].type) {
                if(searchItem.toLowerCase() === markers[i].type[j]) {
                    markers[i].setMap(map);
                    google.maps.event.trigger(markers[i], 'click');
                    self.listArray.push(markers[i]);
                }
            }
        }
    };

    // Creates a click on a marker when a user clicks on one of the list view items
    self.selectMarkerFromList = function(listItem) {
        for(var i in markers) {
            if(listItem.title === markers[i].title) {
                google.maps.event.trigger(markers[i], 'click');
            }
        }
localStorage.removeItem('alerted');
    };

    // Toggles the list view and button text
    self.toggleList = function() {
        if(self.showList() === true) {
            self.showList(false);
            document.getElementById("toggleList").innerHTML = "Show";
        } else {
            self.showList(true);
            document.getElementById("toggleList").innerHTML = "Hide";
        }
    };

    // Filter and  display the relevant markers on screen based on the search
    function filterMarkers() {
        var str = "";
        self.listArray.removeAll();
        for(var i = 0; i < markers.length; i++) {
            for(var j = 0; j < markers[i].type.length; j++) {
                str = markers[i].type[j].substring(0, self.searchQuery().length);
                if(str === self.searchQuery().toLowerCase()) {
                    markers[i].setMap(map);
                    self.listArray.push(markers[i]);
                    break;
                }else{
                    markers[i].setMap(null);
                }
            }
        }
    }

    // Reset markers as they were when the page first loaded

    function resetMarkers() {
        for(var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }
    // Reset list  as they were when the page first loaded

    function resetList() {
        for(var i = 0; i < markers.length; i++) {
            self.listArray.push(markers[i]);
        }
    }







    // Function performs ajax request to Wikipedia
    function wikipediaDescription(marker) {
        url = baseURL + marker.wikiPageHeader + "&format=json&callback=wikiCallbackFunction";
        var wikiRequestTimeout = setTimeout(function() {
          var alerted = localStorage.getItem('alerted') || '';
          if(alerted != 'no') {
          alert("failed wiki resources");
          localStorage.setItem('alerted','no');
          failedToReachWikipedia(marker);
          }
        }, 8000);

        $.ajax(url, {
            dataType: "jsonp",
            success: function(wikiResponse) {
                addClickEventListenerToMarkers(wikiResponse[2][0], marker);
                clearTimeout(wikiRequestTimeout);
            }
        }).fail(function(x, t,m) {
          if(t==='timeout'){alert("got timeout");
        } else {
          alert(t);
        }
      });
    }

    // Function gets called when Wikipedia API fails
    function failedToReachWikipedia(marker) {
        addClickEventListenerToMarkers(marker.title, marker);
    }

    /* Function adds click event listener to markers.When a marker is clicked
       an infowindow appears above the marker */
    function addClickEventListenerToMarkers(response, marker) {
        var infoString = response;
        marker.wikiText = infoString;
        self.listArray.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            map.panTo(marker.getPosition());
            infowindow.setContent(infoString);
            infowindow.open(map, marker);
            toggleBounce(marker.title);
        });
    }

    // Function that  toggles the bounce animation that markers display when they are clicked
    function toggleBounce(text) {
        for(var i = 0; i < markers.length; i++) {
            markers[i].setAnimation(null);
            if(markers[i].title === text) {
                markers[i].setAnimation(google.maps.Animation.BOUNCE);
            }
        }

    }

}

function googleError(){
  alert("Sorry, We are experiencing trouble loading the Google Maps");
}
