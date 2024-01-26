
export const displayMap = (locations) => {
  var map = L.map("map", {
    center: [34.111745, -118.113491],
    zoom: 10,
    interactive: false,
    inertia: false,
    scrollWheelZoom: false,
  });
  L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}",
    {
      minZoom: 0,
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: "png",
    }
  ).addTo(map);
  var myIcon = L.icon({
    iconUrl: "/img/pin.png", // Path to your icon image
    iconSize: [25, 33], // Size of the icon
    iconAnchor: [22, 94], // Point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76], // Point from which the popup should open relative to the iconAnchor
  });
  var bounds = L.latLngBounds(); //Instatntiate latlng objects

  locations.forEach((loc) => {
    const coordinates = [loc.coordinates[1], loc.coordinates[0]];
    L.marker(coordinates, {
      icon: myIcon,
    }).addTo(map);

    //marker.setClass('marker');
    //var bounds=marker.getBounds();
    //bounds.setBounds(bounds);
    L.popup({
      offset: [-10, -75],
    })
      .setLatLng(coordinates)
      .setContent(`Day ${loc.day}: ${loc.description} `)
      .addTo(map);
    bounds.extend(coordinates);

    // console.log(coordinates);
  });
  map.fitBounds(bounds, {
    padding: [200, 100, 80, 80],
  });
  /* const map = L.map('map', {
  maxBounds: [
    [-90, -180],
    [90, 180]
  ]
}); */
};
