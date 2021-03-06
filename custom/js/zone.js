
$(() => {
  $('#btnSaveUpdateZone').click(updateZone);
  $('#btnShowInsertZoneModal').click(showInsertZoneModal);
  $('#btnInsertZone').click(insertZone);
  $('#btnClearZoneMap').click(clearCurrentInsertedZone)
  showZones();
})

var arrCurrentInsertedPointsZone = [];
var mapInsertedZone = null;

function clearCurrentInsertedZone(){
  arrCurrentInsertedPointsZone = [];
  buildInserteZoneMap(mapInsertedZone, arrCurrentInsertedPointsZone);
}

async function inActiveZone(zone){
  const { iZoneID, sZoneName } = zone
  let sure = await showAlertWarning("Are you sure?", "");
  if(sure){
    let sentData = { iZoneIDIN: iZoneID, bStatusIN: 3, sZoneNameIN: 0, sZoneLatLongIN: 0 }
    console.log(JSON.stringify(sentData));
    let response = await Service.inActiveZone(sentData);
    console.log(response);
    showZones();
    showAlertSuccess("Inactive successfully!", "", 2000);
  }
}

async function insertZone(){
  let zoneName = $('#txtInsertZoneName').val();
  if(Validation.checkEmpty(zoneName) && arrCurrentInsertedPointsZone.length > 2){
    let sentData = { iZoneIDIN: 0, sZoneNameIN: zoneName, bStatusIN: 1, sZoneLatLongIN: arrCurrentInsertedPointsZone };
    console.log(JSON.stringify(sentData));
    let response = await Service.insertZone(sentData);
    console.log(response);
    showAlertSuccess("Inserted successfully!", "", 2000);
    arrCurrentInsertedPointsZone = [];
  }else{
    showAlertError("Invalid data", "Name must be filled and the number of selected points must over 2", 3000);
  }
}

async function updateZone(){
  let iZoneIDIN = $('#txtUpdateZoneID').val();
  let sZoneNameIN = $('#txtUpdateZoneName').val();
  if(Validation.checkEmpty(sZoneNameIN)){
    let sentData = { iZoneIDIN, sZoneNameIN, bStatusIN: 2, sZoneLatLongIN: 0 };
    let response = await Service.updateZone(sentData);
    console.log(response);
    showZones();
    showAlertSuccess("Updated successfully", "", 2000);
  }else{
    showAlertError("Invalid data", "Zone name must be filled", 3000);
  }
}

function renderZonesTable(data) {
  let $table = $('#tblZones');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">#</th>
        <th class="trn">ID</th>
        <th class="trn">Name</th>
      </tr>
    `
  )
  if(data){
    data.forEach((zone, index) => {
      const { iZoneID, sZoneName, sZoneLatLong } = zone;
      console.log(typeof sZoneLatLong);
      console.log(typeof JSON.parse(sZoneLatLong));
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${iZoneID}</td>
          <td>${sZoneName}</td>
          <td>
            <button class="btn btn-custom bg-main-color btnShowUpdateZoneModal btn-custom-small">Update</button>
            <button class="btn btn-custom bg-main-color btnInactiveZone btn-custom-small">Inactive</button>
          </td>
        </tr>
      `) 
      $tbody.find('.btnShowUpdateZoneModal').last().click(function(){
        showUpdateZoneModal(zone)
      })
      $tbody.find('.btnInactiveZone').last().click(function(){
        inActiveZone(zone)
      })
    })
  } else {
    alert('No data');
  }

  $table.append($thead).append($tbody);
}

function showUpdateZoneModal(zone){
  const { iZoneID, sZoneName } = zone;
  $('#txtUpdateZoneID').val(iZoneID);
  $('#txtUpdateZoneName').val(sZoneName);
  $('#modalUpdateZone').modal('show');
}

async function showZones(){
  let zones = await Service.getAllZones();
  console.log(zones)
  renderZonesTable(zones);
}

function buildInserteZoneMap(points){
  $mapArea = $('<div id="mapInsertZone" style="height: 350px"></div>');
  $('#modalInsertZone').find('.modal-body .insertZoneMap').html($mapArea);

  mapInsertedZone = L.map('mapInsertZone').setView([20.81715284, 106.77411238], 14);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    id: 'Techpro'
  }).addTo(mapInsertedZone);

  L.icon = function (options) {
    return new L.Icon(options);
  };

  var LeafIcon = L.Icon.extend({
    options: {
      iconSize: [15, 15]
    }
  });
  let Error = new LeafIcon({
    iconUrl: '../img/error.png'
  });

  mapInsertedZone.on('click', function(e){
    handleClickOnMapZone(e);
  });

  // L.marker([lon, lat], {icon: Error}).bindTooltip(message).addTo(mymap);
  // message = message + "<br> <center><img src='" + imgurl + "' alt = '' style='width:144px;height:256px;'></center>";
  if(arrCurrentInsertedPointsZone.length > 0){
    arrCurrentInsertedPointsZone.forEach(point => {
      // let dAlertLat = point[0];
      // let dAlertLong = point[1];
      L.marker(point, {
        icon: Error
      }).addTo(mapInsertedZone)
    })
    drawPolygon(mapInsertedZone, arrCurrentInsertedPointsZone);
  }
  
}
function handleClickOnMapZone(e){
  const {lat, lng} = e.latlng;
  //arrNewAddedPoints.push([lat, lng]);
  $('.latPoint').text(lat);  
  $('.longPoint').text(lng);  
  arrCurrentInsertedPointsZone.push([lat, lng]);
  console.log(arrCurrentInsertedPointsZone);
  if(mapInsertedZone){
    drawPolygon(mapInsertedZone, arrCurrentInsertedPointsZone);
  }
  // let polygon = L.polyline(arrNewAddedPoints, {color: 'red'}).addTo(map);
  // popup
  //   .setLatLng(e.latlng)
  //   .setContent("You clicked the map at " + e.latlng.toString())
  //   .openOn(mymap);
}

function drawPolygon(map, latlngs){
  // create a red polygon from an array of LatLng points
  var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
  // zoom the map to the polygon
  map.fitBounds(polygon.getBounds());
}

function showInsertZoneModal(){
  $('#modalInsertZone').modal('show');
  setTimeout(() => {
    buildInserteZoneMap();
  }, 500);
}