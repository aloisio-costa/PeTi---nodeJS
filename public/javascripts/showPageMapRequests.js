
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: request.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(request.geometry.coordinates)
    // .setPopup(
    //     new mapboxgl.Popup({offset: 25})
    //     .setHTML(
    //         `<h3>${request.petname}</h3><p>${request.location}</p>`
    //     )
    // )
    .addTo(map)