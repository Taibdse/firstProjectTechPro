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
  $('#btnSaveSelectedPoints').click(saveRoute);
  $('#selectZonesFilter').change(showRoutesOnTable);
  $('#modalUpdateRouteGuard').find('.btn.btnSaveRouteUpdateGuard').click(updateGuardRoute);
  showRouteMap();
  showAllZones();
  showPointsOnZone();
  showRoutesOnTable();
  showGuardIdOnCombobox();
  showZonesOnJcomboboxFilter();
})

var arrSelectedPointsOnRoute = [];
var arrPointsOnZone = [];
var currentUpdatedRoute = null;

function buildRouteMap(data){
  let $mapArea = $('<div id="routeMap" class="map"></div>');
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
  $('.selectZones').html('');
  if (data) {
    data.forEach(zone => {
      $('.selectZones').append(`<option value="${zone.iZoneID}">${zone.sZoneName}</option>`)
    })
  }
}

function renderZoneOnJcomboboxFilter(data) {
  $('#selectZonesFilter').html('');
  $('#selectZonesFilter').append(`<option value="0">All</option>`)
  if (data) {
    data.forEach(zone => {
      $('#selectZonesFilter').append(`<option value="${zone.iZoneID}">${zone.sZoneName}</option>`)
    })
  }
}
async function showZonesOnJcomboboxFilter(){
  let data = await Service.getAllZones();
  renderZoneOnJcomboboxFilter(data);
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

async function saveRoute(){
  let RouteName = $('#txtSaveRouteName').val();
  let arrPoints = arrSelectedPointsOnRoute.map((p, index) => {
    const { iPointID } = p;
    return {PointID: iPointID, No: index + 1}
  })
  let sentData = {RouteID: 0, RouteName, bStatusIN: 1, Point: arrPoints };
  console.log(JSON.stringify(sentData));
  let response = await Service.saveRoute(sentData);
  console.log(response);
}

async function deleteRoute(routeId){
  let RouteName = $('#txtSaveRouteName').val();
  // let arrPoints = arrSelectedPointsOnRoute.map((p, index) => {
  //   const { iPointID } = p;
  //   return {PointID: iPointID, No: index + 1}
  // })
  let sentData = { RouteID: routeId, RouteName, bStatusIN: 2, Point: 0 };
  let response = await Service.deleteRoute(sentData);
  console.log(response);
}

async function showRoutesOnTable(){
  let zoneId = $('#selectZonesFilter').val();
  if(!zoneId) zoneId = 0;
  let sentData = { iZoneIDIN: zoneId };
  let routes = await Service.getRoutesOnZone(sentData);
  console.log(routes);
  renderTableRoutes(routes);
}

function renderTableRoutes(routes){
  let $table = $('#tblRoutes');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">ZoneId</th>
        <th class="trn">Route name</th>
        <th class="trn">RouteId</th>
        <th class="trn">Distance</th>
        <th class="trn">DateTimeUpdate</th>
        <th class="trn">TimeComplete</th>
        <th class="trn">Active</th>
        <th class="trn">GuardID</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (routes) {
    routes.forEach(route => {
      const { bActive, dDateTimeUpdate, dDistance, iGuardID, iRouteID, iTimeComplete, iZoneID, sRouteName } = route;
      $tbody.append(`
        <tr>
          <td>${iZoneID}</td>
          <td>${sRouteName}</td>
          <td>${iRouteID}</td>
          <td>${dDistance}</td>
          <td>${dDateTimeUpdate}</td>
          <td>${iTimeComplete}</td>
          <td>${bActive}</td>
          <td>${iGuardID}</td>
          <td>
            <button class="btn btn-custom bg-main-color btnRouteUpdateGuard btn-custom-small">Update</button>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btnRouteUpdateGuard').last().click(function(){
        showUpdateRouteGuardModal(route);
      })
    })
  }

  $table.append($thead).append($tbody);
}

function showUpdateRouteGuardModal(route){
  const { iGuardID, iRouteID, iZoneID, sRouteName } = route;
  currentUpdatedRoute = route;
  $('#modalUpdateRouteGuard').find('.listUpdatedRoute').text(`${sRouteName} - ${iRouteID} on zone ${iZoneID}`);
  $('#modalUpdateRouteGuard').find('.currentGuard').text(`Current guard id: ${iGuardID}`);
  $('#modalUpdateRouteGuard').modal('show');
}

async function showGuardIdOnCombobox(){
  let guards = await Service.getPersonalGuardsInfo();
  $('.selectGuards').html('');
  console.log(guards)
  guards.forEach(guard => {
    const { iGuardID, sGuardName } = guard;
    $('.selectGuards').append(`<option value="${iGuardID}">${sGuardName}</option>`)
  })
}

async function updateGuardRoute(){
  let guardId = $('#modalUpdateRouteGuard').find('.selectGuards').val();
  let sentData = { iGuardIDIN: guardId, iRouteIDIN: currentUpdatedRoute.iRouteID };
  console.log(JSON.stringify(sentData));
  let response = await Service.updateRouteGuard(sentData);
  showRoutesOnTable();
  console.log(response);
}

// {
//   "RouteID": "1",
//   "RouteName": "Route 1",
//   "bStatusIN":"1",
//     "Point": [
//       {"PointID": "100", "No": "1"},
//       {"PointID": "101", "No": "2"},
//       {"PointID": "102", "No": "3"}
//     ]
// }