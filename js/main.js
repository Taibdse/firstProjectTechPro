var mymap = L.map('mapid').setView([51.505, -0.09], 13);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYnVpZHVjdGFpIiwiYSI6ImNqaHVwMTU3ZTBjcm4zcHBpZWd5NDJqOXEifQ._eno5PS-PLTNJTDR_27Pzg';
var map = new mapboxgl.Map({
  container: 'mapid',
  style: 'mapbox://styles/mapbox/streets-v10'
});

map.on('load', function () {

  map.addLayer({
    'id': 'population',
    'type': 'circle',
    'source': {
      type: 'vector',
      url: 'mapbox://examples.8fgz4egr'
    },
    'source-layer': 'sf2010',
    'paint': {
      // make circles larger as the user zooms from z12 to z22
      'circle-radius': {
        'base': 1.75,
        'stops': [
          [12, 2],
          [22, 180]
        ]
      },
      // color circles by ethnicity, using a match expression
      // https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
      'circle-color': [
        'match', ['get', 'ethnicity'],
        'White', '#fbb03b',
        'Black', '#223b53',
        'Hispanic', '#e55e5e',
        'Asian', '#3bb2d0',
        /* other */
        '#ccc'
      ]
    }
  });
});

$('.datepicker').datepicker();

$('.datetimepicker').datetimepicker({format: 'yyyy-mm-dd hh:ii'});
