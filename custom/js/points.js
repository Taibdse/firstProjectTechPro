$(() => {
  
  $('#btnPointsData').click(showPointsData);
  $('#btnMapAllPoints').click(function(){
    showPointsMap()
  })
  $('#btnShowInsertPointModal').click(showInsertPointModal);
  $('#btnUpdatePoint').click(updatePoint);
  $('#btnInsertPoint').click(insertPoint);

  showAllZones();
  
})

var arrNewAddedPoints = [];
var arrCurrentPointsOnZone = [];
var arrZones = [];
let currentUpdatedPoint = null;

async function showAllZones() {
  let data = await Service.getAllZones();
  showPointsData(data);
}

function renderZoneOnJcombobox(data) {
  console.log(data);
  
  if (data) {
    for(let i = 0; i < $('.selectZones').length; i++){
      $('.selectZones').eq(i).html('');
      data.forEach(zone => {
        $('.selectZones').eq(i).append(`<option value="${zone.iZoneID}">${zone.sZoneName}</option>`)
      })
    }
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
  if(points && points.length > 0){
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
  $('#modalMapPoint').modal('show');
  console.log(arrCurrentPointsOnZone)
  setTimeout(() => {
    buildPointsMap(arrCurrentPointsOnZone, 'mapPoint');
  }, 500);
  
}

async function showPointsData() {
  let zoneId = $('#jcomboboxZone').val();
  if(zoneId){
    let sentData = { iZoneID: zoneId };
    let data = await Service.getPointsDataOnZone(sentData);
    if(data) arrCurrentPointsOnZone = [...data];
    else arrCurrentPointsOnZone = [];
    renderPointsTable(data);
  }
}

function showInsertPointModal(){
  currentUpdatedPoint = null;
  let $mapArea = $('<div id="mapPointInsert" class="mymap"></div>'); 
  $('#insertPointMap').html($mapArea);
  $('#modalInsertPoint').modal('show');
  setTimeout(() => {
    buildPointsMap(arrCurrentPointsOnZone, 'mapPointInsert');
  }, 500);
}

function showUpdatePointModal(point){
  const {iPointID, sPointCode, sZoneName, dPointLat, dPointLong, dDateTimeAdd} = point
  currentUpdatedPoint = point;
  let $mapArea = $('<div id="mapPointUpdate" class="mymap"></div>'); 
  $('#updatePointMap').html($mapArea);

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
  setTimeout(() => {
    buildPointsMap([point], 'mapPointUpdate');
  }, 500);
}

async function inActivePoint(point){
  //delete point here
  const {  iPointID } = point;
  let sure = await showAlertWarning("Are you sure!", "");
  if(sure){
    let sentData = {iPointIDIN: iPointID, bStatusIN: 4, iZoneIDIN: 0,  sPointCodeIN: 0, dGPSLatIN: 0, dGPSLongIN: 0};
    // {"iPointIDIN":"78","bStatusIN":4,"iZoneIDIN":null,"sPointCodeIN":null,"dGPSLatIN":null,"dGPSLongIN":null}
    console.log(JSON.stringify(sentData))
    let response = await Service.inActivePoint(sentData);
    console.log(response);
    showPointsData();
    showAlertSuccess("Inactive successfully!", "", 2000);
  }
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
  showPointsData();
  console.log(response);
  showAlertSuccess("Update successfully!", "", 2000);
}

async function insertPoint(){
  let lat = $('#latInsertPoint').text();
  let lng = $('#longInsertPoint').text();
  let zoneId = $('#selectZoneInsertPoint').val();
  let pointCode = $('#txtInsertPointCode').val();
  let radio = $('#modalInsertPoint').find('input[name="radioGPS"]');
  console.log(lat, lng, zoneId, pointCode);
  var sentData = null;
  if(radio[0].checked){
    if(lat.trim() == '' || lng.trim() == '') 
      return showAlertError("Invalid data", "", 2000);
    sentData = { dGPSLatIN: Number(lat), dGPSLongIN: Number(lng), iZoneIDIN: zoneId, sPointCodeIN: 0, bStatusIN: 1, iPointIDIN: 0 };
  }else if(radio[1].checked){
    if(pointCode.trim() == '') return showAlertError("Invalid data", "", 2000);
    sentData = { dGPSLatIN: 0, dGPSLongIN: 0, iZoneIDIN: zoneId, sPointCodeIN: pointCode, bStatusIN: 1, iPointIDIN: 0 };
  }

  if(!radio[0].checked && !radio[1].checked)
    return showAlertError("Invalid data", "", 2000);
  // {"dGPSLatIN":20.798003814373477,"dGPSLongIN":106.78728103637697,"iZoneIDIN":"1","sPointCodeIN":"P123456","bStatusIN":1,"iPointIDIN":null}
  let data = await Service.insertPoint(sentData);
  showPointsData();
  console.log(data);
  showAlertSuccess("Insert successfully!", "", 2000); 
}
