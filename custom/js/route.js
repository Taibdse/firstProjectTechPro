$(() => {
  // enable alert 
  $('.alert').alert();
  $( ".sortable" ).sortable({
    update: function(event, ui){
      let alerts = $(event.target).find('.alert');
      arrSelectedPointsOnRoute = [];
      Array.from(alerts).forEach(alert => {
        let id = alert.dataset.point
        let point = arrPointsOnZone.find(p => p.iPointID == id.trim());
        arrSelectedPointsOnRoute.push(point);
      })
      setTimeout(() => {
        showRouteMap(arrSelectedPointsOnRoute);
      }, 100)
    }
  }); 
  $('#selectRouteZone').change(() => {
    showPointsOnZone();
    $('#selectedPointsOnRoute').html('');
    showRouteMap(null);
  }) 
  showRouteMap();
  showAllZones();
  showPointsOnZone();
})

var arrSelectedPointsOnRoute = [];
var arrPointsOnZone = [];

function buildRouteMap(data){
  let $mapArea = $('<div id="routeMap" style="width:100%; height: 450px"></div>');
  $('.card-route-map').find('.card-body').html($mapArea);
  var mymap = L.map('routeMap').setView([20.81715284, 106.77411238], 14);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    id: 'Techpro'
  }).addTo(mymap);

  var LeafIcon = L.Icon.extend({
    options: {
      iconSize: [15, 15]
    }
  });

  L.icon = function (options) {
    return new L.Icon(options);
  };

  var Checked = new LeafIcon({
       iconUrl: '../img/Checked.png'
    });
    
    if(data){
      let arrPointsCoordination = [];
      data.forEach((point, index) => {
        const { dPointLat, dPointLong, iPointID} = point;
        let pos = [Number(dPointLat), Number(dPointLong)];
        let mes = `${index + 1} - ${iPointID}`;
        arrPointsCoordination.push(pos)
        L.marker(pos, {
         icon: Checked
        }).bindTooltip(mes, {
          permanent: true,
          interactive: true
        }).addTo(mymap);
      })
      var polyline = new L.Polyline([
        arrPointsCoordination
      ], {
        color: 'green',
        weight: 5,
        opacity: 0.5
      }).addTo(mymap);
      mymap.fitBounds(polyline.getBounds());
    }

  // {"iPointID":"78","sPointCode":null,"sZoneName":"Zone 1","dPointLat":"20.82054995","dPointLong":"106.77008481","dDateTimeAdd":"2018-04-27 16:08:27","iNo":"1","iZoneID":"1"}
  // let mes = `${sGuardName} - ${dLastUpdateTime}`;
  // let pos = [Number(dGuardLongCurrent), Number(dGuardLatCurrent)]

  // L.marker(pos, {
  //   icon: Guard
  // }).bindTooltip(mes, {
  //   permanent: true,
  //   interactive: true
  // }).addTo(mymap);

}

function showRouteMap(data){
  buildRouteMap(data);
}

function renderZoneOnJcombobox(data) {
  $('#selectRouteZone').html('');
  if (data) {
    data.forEach(zone => {
      $('#selectRouteZone').append(`<option value="${zone.iZoneID}">${zone.sZoneName}</option>`)
    })
  }
}

async function showAllZones(){
  let data = await Service.getAllZones();
  renderZoneOnJcombobox(data);
}

async function showPointsOnZone(){
  let iZoneID = $('#selectRouteZone').val();
  if(!iZoneID) iZoneID = 1;
  let sentData = { iZoneID };
  let points = await Service.getPointsDataOnZone(sentData);
  if(points) arrPointsOnZone = points.slice();
  else arrPointsOnZone = [];
  arrSelectedPointsOnRoute = [];
  renderPointsOnZone(points);
}

function renderPointsOnZone(points){
  $('#pointsOnZone').html('');
  if(points){
    points.forEach(point => {

      const { iPointID, dPointLat, dPointLong } = point;
      if(dPointLat != null && dPointLong != null){
        $('#pointsOnZone').append(`
        <li class="list-group-item">
          <input type="checkbox" class="checkbox-custom checkboxPoint" style="margin-right: 10px" value="${iPointID}">
          <span class="point">PointID ${iPointID}</span>
        </li>
      `)
      $('#pointsOnZone').find('.checkboxPoint').last().change(function(e){
        showSelectedPointWhenCheckbox(e, point);
      })
      }
    })
  }
}

function showSelectedPointWhenCheckbox(e, point){
  let { checked, value } = e.target;
  if(checked){
    arrSelectedPointsOnRoute.push(point);
    renderListOfSelectedPoints(arrSelectedPointsOnRoute);
  }else{
    let index = arrSelectedPointsOnRoute.findIndex(point => point.iPointID == value);
    arrSelectedPointsOnRoute.splice(index, 1);
    renderListOfSelectedPoints(arrSelectedPointsOnRoute);
  }
  setTimeout(() => {
    showRouteMap(arrSelectedPointsOnRoute);
  }, 100)
}

function showSelectedPointWhenRemoveAlert(point){
  let index = arrSelectedPointsOnRoute.findIndex(p => point.iPointID == p.iPointID);
  arrSelectedPointsOnRoute.splice(index, 1);
  renderListOfSelectedPoints(arrSelectedPointsOnRoute);
  let checkboxes = $('#pointsOnZone').find('.checkboxPoint');
  Array.from(checkboxes).forEach(checkbox => {
    if($(checkbox).val().trim() == point.iPointID){
      $(checkbox).prop({checked: false});
    }
  })
  setTimeout(() => {
    showRouteMap(arrSelectedPointsOnRoute);
  },100)
}

function renderListOfSelectedPoints(selectedPoints){
  if(selectedPoints){
    $('#selectedPointsOnRoute').html('');
    selectedPoints.forEach(point => {
      const { iPointID, dPointLat, dPointLong } = point;
      $('#selectedPointsOnRoute').append(`
        <div class="alert alert-success alert-dismissible fade show" role="alert" data-point="${iPointID}">${iPointID} - Lat: ${dPointLat} Lng: ${dPointLong}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `)
      $('#selectedPointsOnRoute').find('.alert').last().on('closed.bs.alert', function(e){
        showSelectedPointWhenRemoveAlert(point)
      })
    })
  }
}

// let sentData = {
//   RouteID: 1,
//   RouteName:'name 1'
//   Points: [
//     {id: 89, pos: 1},
//     {id: 78, pos: 2},
//     {id: 56, pos: 3},
//     {id: 45, pos: 4},
//     {id: 34, pos: 5},
//   ]
// }
