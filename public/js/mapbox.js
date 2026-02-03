/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoib21hcjEwMSIsImEiOiJjbWt4MXJpbmIwNHAyM2ZzNGQ5ZnRyMHE4In0.uqyl_bEPluS2hjFdTbFXlA';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/omar101/cmkx58y86001u01r40duq2q12', // style URL
    scrollZoom: false,
    // center: [2.294694, 48.858093], // starting position [lng, lat]
    // zoom: 11, // starting zoom
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .setPopup()
      .addTo(map);
    //Add  Popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: : ${loc.description}</p>`)
      .addTo(map);

    // Extend The Map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
