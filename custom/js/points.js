$(() => {

  $('#btnPointsData').click(showPointsData);
  $('#btnMapAllPoints').click(function(){
    showPointsMap()
  })
  $('#btnInsertPoint').click(showInsertPointModal);
  $('#btnUpdatePoint').click(updatePoint);
  showAllZones();
  
})

const arrNewAddedPoints = [];
const arrCurrentPoints = [];
const arrZones = [];
let currentUpdatedPoint = null;

async function showAllZones() {
  let data = await Service.getAllZones();
  renderZoneOnJcombobox(data);
  showPointsData();
}

function renderZoneOnJcombobox(data) {
  $('#jcomboboxZone').html('');
  if (data) {
    data.forEach(zone => {
      $('#jcomboboxZone').append(`<option value="${zone.iZoneID}">${zone.sZoneName}</option>`)
    })
  }
}

function renderPointsTable(data) {
  let $table = $('#tblPoints');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  // Display detail Incident: Zone, Code, Lat, Long, DateTime

  $thead.html(
    `
      <tr>
        <th class="trn">Zone</th>
        <th class="trn">ID</th>
        <th class="trn">Code</th>
        <th class="trn">Lat</th>
        <th class="trn">Long</th>
        <th class="trn">DateTime</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (data) {
    data.forEach(point => {
      const {sZoneName, sPointCode, dPointLat, dPointLong, dDateTimeAdd, iPointID} = point;
      $tbody.append(`
        <tr>
          <td>${sZoneName}</td>
          <td>${iPointID}</td>
          <td>${sPointCode}</td>
          <td>${dPointLat}</td>
          <td>${dPointLong}</td>
          <td>${dDateTimeAdd}</td>
          <td>
            <button class="btn btn-custom bg-main-color btnPointUpdate btn-custom-small">Update</button>
            <button class="btn btn-custom bg-main-color btnPointDelete btn-custom-small" style="margin-left:-5px">In aciive</button>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btnPointUpdate').last().click(function(){
        showUpdatePointModal(point);
      })
      $tbody.find('.btn.btnPointDelete').last().click(function(){
        inActivePoint(point);
      })
    })
  }

  $table.append($thead).append($tbody);
}

function buildPointsMap(points, id){
  var map = L.map(id).setView([20.81715284, 106.77411238], 14);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    id: 'Techpro'
  }).addTo(map);

  var LeafIcon = L.Icon.extend({
    options: {
      iconSize: [15, 15]
    }
  });
  var Checked = new LeafIcon({
    iconUrl: '../img/Checked.png'
  });

  //handle click
  let popup = L.popup();
  map.on('click', function(e){
    handleClickPointMap(e, popup, map, L);
  });

  //show all points
  if(points){
    points.forEach(point => {
      let mes = `Lat: ${point.dPointLat},\n Lng: ${point.dPointLong}`;
      let pos = [Number(point.dPointLat), Number(point.dPointLong)];
      L.marker(pos, {
        icon: Checked
      }).bindTooltip(mes, {
        permanent: true,
        interactive: true
      }).addTo(map);
      // L.marker(pos, { icon: Checked }).addTo(map)
      // .bindPopup(`Lat: ${point.dPointLat},\n Lng: ${point.dPointLong}`)
      // .openPopup();
    })
  }
}

function handleClickPointMap(e, popup, map, L){
  const {lat, lng} = e.latlng;
  //arrNewAddedPoints.push([lat, lng]);
  $('.latPoint').text(lat);  
  $('.longPoint').text(lng);  
  // let polygon = L.polyline(arrNewAddedPoints, {color: 'red'}).addTo(map);
  // popup
  //   .setLatLng(e.latlng)
  //   .setContent("You clicked the map at " + e.latlng.toString())
  //   .openOn(mymap);
}

function showPointsMap(){
  let $mapArea = $('<div id="mapPoint" class="mymap" style="height:400px"></div>'); 
  $('#modalMapPoint').find('.modal-body').html($mapArea);
  buildPointsMap(arrCurrentPoints, 'mapPoint');
  $('#modalMapPoint').modal('show');
}

async function showPointsData() {
  let zoneId = $('#jcomboboxZone').val();
  if(zoneId){
    let sentData = { iZoneID: zoneId };
    let data = await Service.getPointsDataOnZone(sentData);
    renderPointsTable(data);
  }
}

function showInsertPointModal(){
  let $mapArea = $('<div id="mapPointInsert" class="mymap"></div>'); 
  $('#insertPointMap').html($mapArea);
  buildPointsMap([], 'mapPointInsert');
  $('#modalInsertPoint').modal('show');
}

function showUpdatePointModal(point){
  const {iPointID, sPointCode, sZoneName, dPointLat, dPointLong, dDateTimeAdd} = point
  currentUpdatedPoint = point;
  let $mapArea = $('<div id="mapPointUpdate" class="mymap"></div>'); 
  $('#updatePointMap').html($mapArea);
  buildPointsMap([point], 'mapPointUpdate');

  let lat = Number(dPointLat);
  let lng = Number(dPointLong);
  $('#txtUpdatepointCode').val(sPointCode);
  if(lat == 0 && lng == 0){
    $('#latUpdatePoint').text('');
    $('#longUpdatePoint').text('');
    currentUpdatedPoint.GPS = false;
  }else{
    $('#latUpdatePoint').text(dPointLat);
    $('#longUpdatePoint').text(dPointLong);
    currentUpdatedPoint.GPS = true;
  }
  $('#modalUpdatePoint').modal('show');
}

function inActivePoint(point){
  //delete point here

  
  console.log(point);
  let sentData = {}
}

async function updatePoint(){
  let { iPointID, iZoneID, GPS } = currentUpdatedPoint;
  let lat = Number($('#latUpdatePoint').text());
  let lng = Number($('#longUpdatePoint').text());
  let pointCode = $('#txtUpdatepointCode').val();
  let sentData = '';
  if(!GPS){
    sentData = { 
      bStatusIN: 2, 
      dGPSLatIN: 0, 
      dGPSLongIN: 0, 
      sPointCodeIN: pointCode, 
      iPointIDIN: iPointID, 
      iZoneIDIN: iZoneID
    };
  }else{
    sentData = { 
      bStatusIN: 3, 
      dGPSLatIN: lat, 
      dGPSLongIN: lng, 
      sPointCodeIN: pointCode, 
      iPointIDIN: iPointID, 
      iZoneIDIN: iZoneID 
    };
  }
  let response = await Service.updatePoint(sentData);
}