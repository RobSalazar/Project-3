// Creating the map object
var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
});


// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);



//This determines what state is going to be loaded onto our dashboard (iterates through)
d3.json("/static/data/state_data.json").then(function(stateData){

var state_list = []
for (i=0; i<stateData.length;i++){
    state_list.push(stateData[i].StateName)
}

//This is giving our states a conditional color depending on there latest happiness score
d3.json("/static/data/us_states.json").then(function(data) {
    function getColor(d) {
        return stateData[state_list.indexOf(d)].happy_score[9] > 7.5   ? '#339966' :
              stateData[state_list.indexOf(d)].happy_score[9] > 7.2 ? '#99CC00' :
              stateData[state_list.indexOf(d)].happy_score[9] > 6.5   ? '#FFCC00' :
              stateData[state_list.indexOf(d)].happy_score[9] > 6 ? '#FF9900' :
             '#993300';
    }

    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // Styling each feature (in this case, a neighborhood)
        style: function(feature) {
            return {
                fillColor: getColor(feature.properties.name),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        },
        // This is called on each feature.
        onEachFeature: function(feature, layer) {
            // Set the mouse events to change the map styling.
            layer.on({
                // When a user's mouse cursor touches a map feature, the mouseover event calls this function, which makes that feature's opacity change to 90% so that it stands out.
                mouseover: function(event) {
                    layer = event.target;
                    layer.openPopup();
                    layer.setStyle({
                        fillOpacity: 0.9
                        
                    });
                },
                // When the cursor no longer hovers over a map feature (that is, when the mouseout event occurs), the feature's opacity reverts back to 50%.
                mouseout: function(event) {
                    layer = event.target;
                    layer.closePopup();
                    layer.setStyle({
                        fillOpacity: 0.7
                    });
                },
                // When a feature (neighborhood) is clicked, it enlarges to fit the screen.
                click: function redirect(e) {
                    let state = feature.properties.name
                    console.log(state)
                    console.log(state_list)
                    var url = `/dashboard/${state}`;
                    window.location.href = url;
                }
            });
            // Giving each feature a popup with information that's relevant to it
            layer.bindPopup("<h2>" + feature.properties.name + "</h2>");

        }
    }).addTo(myMap);
});
});