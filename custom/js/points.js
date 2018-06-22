$(() => {

  $('#btnPointsData').click(showPointsData);
  $('#btnMapAllPoints').click(showMapAllPoints)
  showAllZones();
  
})

const arrNewAddedPoints = [];
const arrPoints = [];
async function getAllZoneId() {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GetZone.php',
    method: 'post',
  });
  if (data) return data;
  return null;
}

async function showAllZones() {
  let data = await getAllZoneId();
  renderZoneOnJcombobox(JSON.parse(data));
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

async function getPointsData() {
  let zoneID = $('#jcomboboxZone').val();
  if (zoneID) {
    let sentData = {
      iZoneID: zoneID
    };
    let data = await $.ajax({
      url: 'http://115.79.27.219/tracking/api/GetPointData.php',
      method: 'post',
      data: JSON.stringify(sentData)
    });
    if (data) {
      arrPoints.length = 0;
      JSON.parse(data).forEach(item => arrPoints.push(item));
      return JSON.parse(data);
    }
    return null;
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
      $tbody.append(`
        <tr>
          <td>${point.sZoneName}</td>
          <td>${point.sPointCode}</td>
          <td>${point.dPointLat}</td>
          <td>${point.dPointLong}</td>
          <td>${point.dDateTimeAdd}</td>
          <td><button class="btn btn-custom bg-main-color btnPointMap btn-custom-small">Map</button></td>
        </tr>
      `)
      $tbody.find('.btnPointMap').last().click(function(){
        showPointMap(point);
      })
    })
  }

  $table.append($thead).append($tbody);
}

function buildPointMap(point){
  let pos = [Number(point.dPointLat), Number(point.dPointLong)];
  const map = L.map('mapPoint').setView([20.81715284, 106.77411238], 14);
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

  L.marker(pos, { icon: Checked }).addTo(map)
  .bindPopup(`Lat: ${point.dPointLat},\n Lng: ${point.dPointLong}`)
  .openPopup();

  let popup = L.popup();
  map.on('click', function(e){
    handleClickPointMap(e, popup, map, L);
  });
}

function handleClickPointMap(e, popup, map, L){
  const {lat, lng} = e.latlng;
  arrNewAddedPoints.push([lat, lng]);
  console.log(arrNewAddedPoints);
  let polygon = L.polyline(arrNewAddedPoints, {color: 'red'}).addTo(map);
  // popup
  //   .setLatLng(e.latlng)
  //   .setContent("You clicked the map at " + e.latlng.toString())
  //   .openOn(mymap);
}

function showPointMap(point){
  let $mapArea = $('<div id="mapPoint" class="mymap"></div>'); 
  $('#modalMapPoint').find('.modal-body').html($mapArea);
  buildPointMap(point);
  $('#modalMapPoint').modal('show');
}

async function showPointsData() {
  let data = await getPointsData();
  renderPointsTable(data);
}

function showMapAllPoints(){

}