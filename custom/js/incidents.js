
$(() => {

  $('#btnIncidentsData').click(showIncidentsData);

  formatTodayIncident();

})

async function showIncidentsData() {
  let datetime = $('#incidentDatetime').val();
  if(datetime == '') return alert('No datetime');
  let sentData = {dDateTime : changeFormatDateTime(datetime)};
  let data = await getIncidentsData(JSON.stringify(sentData));
  renderIncidentsTable(data);
}

function changeFormatDateTime(time){
  let arr = time.split('/');
  let y = arr[2];
  let d = arr[1];
  let m = arr[0];
  return `${y}-${m}-${d}`;
}

async function getIncidentsData(sentData) {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GetIncidentData.php',
    method: 'post',
    data: sentData
  });
  if (data) return JSON.parse(data);
  return null;
}

function renderIncidentsTable(data) {
  let $table = $('#tblIncidents');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn"></th>
        <th class="trn">Name</th>
        <th class="trn">Zone</th>
        <th class="trn">Date</th>
        <th class="trn">Start</th>
        <th class="trn">End</th>
        <th class="trn">Image</th>
        <th class="trn">Description</th>
        <th class="trn">Map</th>
      </tr>
    `
  )
  if(data){
    data.forEach(incident => {
      $tbody.append(`
        <tr>
          <td>
            <input type="checkbox" class="checkbox-custom checkbox-incident">
          </td>
          <td>${incident.sGuardName}</td>
          <td>${incident.sZoneName}</td>
          <td>${incident.dDateTimeIntinial}</td>
          <td>${incident.dDateTimeStart}</td>
          <td>${incident.dDateTimeEnd}</td>
          <td>
            <img src="http://115.79.27.219/tracking/${incident.ImageUrl}" alt="Image here" style="width:60px; height: 80px" onClick="showIncidentImage('${incident.ImageUrl}')">
          </td>
          <td>${incident.sAlertDescription}</td>
          <td>
            <button class="btn btn-custom bg-main-color btnShowIncidentMap"> Map</button>
          </td>
        </tr>
      `) 
      $tbody.find('.btnShowIncidentMap').last().click(function(){
        showMapIncident(incident)
      })
    })
  } else {
    alert('No data');
  }

  $table.append($thead).append($tbody);
}

function showIncidentImage(urlImage){
  $('#incidentImg').attr({src: `http://115.79.27.219/tracking/${urlImage}`})
  $('#modalIncidentImage').modal('show');
}

function formatTodayIncident() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  let mon = month < 10 ? `0${month}` : month;
  let d = day < 10 ? `0${day}` : day;
 
  $('#incidentDatetime').val(`${mon}/${d}/${year}`);

  showIncidentsData();
}

function buildIncidentMap(incident){
  let pos = [Number(incident.dAlertLat), Number(incident.dAlertLong)];
  $mapArea = $('<div id="mapIncident" style="height: 300px"></div>');
  $('#modalIncidentMap').find('.modal-body').html($mapArea);

  var map = L.map('mapIncident').setView([20.81715284, 106.77411238], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker(pos).addTo(map)
      .bindPopup('')
      .openPopup();
}

function showMapIncident(incident){
  buildIncidentMap(incident);
  $('#modalIncidentMap').modal('show');
}