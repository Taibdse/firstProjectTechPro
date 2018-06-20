
$(() => {

  $('#btnPointsData').click(showPointsData);
  showAllZones();
})

async function getAllZoneId(){
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GetZone.php',
    method: 'post',
  });
  if(data) return data;
  return null;
}

async function showAllZones(){
  let data = await getAllZoneId();
  console.log(data);
  renderZoneOnJcombobox(JSON.parse(data));
}

function renderZoneOnJcombobox(data){
  if(data){
    let html = '';
    data.forEach(zone => {
      html += `<option value="${zone.iZoneID}">${zone.sZoneName}</option>`
    })
    $('#jcomboboxZone').html(html);
  }
}

async function getPointsData() {
  let zoneID = $('#jcomboboxZone').val();

  let sentData = {iZoneID: zoneID};
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GetPointData.php',
    method: 'post',
    data: JSON.stringify(sentData)
  });
  if (data) return JSON.parse(data);
  return null;
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
      </tr>
    `
  )
  if(data){
    let htmltBody = '';
    data.forEach(point => {
      htmltBody +=
        `
        <tr>
          <td>${point.sZoneName}</td>
          <td>${point.sPointCode}</td>
          <td>${point.dPointLat}</td>
          <td>${point.dPointLong}</td>
          <td>${point.dDateTimeAdd}</td>
        </tr>
      `
    })
    $tbody.html(htmltBody);
  } else {
    alert('No data');
  }

  $table.append($thead).append($tbody);
}

async function showPointsData() {
  let data = await getPointsData();
  renderPointsTable(data);
}

