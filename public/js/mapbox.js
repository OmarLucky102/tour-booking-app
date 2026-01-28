/* eslint-disable */

// console.log('hellow form the client side');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoib21hcjEwMSIsImEiOiJjbWt4MXJpbmIwNHAyM2ZzNGQ5ZnRyMHE4In0.uqyl_bEPluS2hjFdTbFXlA';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/omar101/cmkx58y86001u01r40duq2q12', // style URL
  center: [2.294694, 48.858093], // starting position [lng, lat]
  zoom: 11, // starting zoom
});
