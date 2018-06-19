// http://192.168.1.128:8080/tracking/api/GetIncidentData.php

$(() => {

  $('#btnIncidentsData').click(showIncidentsData);

  formatToday();

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
    url: 'http://192.168.1.128:8080/tracking/api/GetIncidentData.php',
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
  // Display detail Incident: Code, Name, Zone, Start, End, Image, Description

  $thead.html(
    `
      <tr>
        <th class="trn">Code</th>
        <th class="trn">Name</th>
        <th class="trn">Zone</th>
        <th class="trn">Start</th>
        <th class="trn">End</th>
        <th class="trn">Image</th>
        <th class="trn">Description</th>
      </tr>
    `
  )
  if(data){
    let htmltBody = '';
    data.forEach(incident => {
      htmltBody +=
        `
        <tr>
          <td>${incident.sCheckingCode}</td>
          <td>${incident.sGuardName}</td>
          <td>${incident.sZoneName}</td>
          <td>${incident.dDateTimeStart}</td>
          <td>${incident.dDateTimeEnd}</td>
          <td><img src="http://115.79.27.219/tracking/${incident.ImageUrl}" alt="Image here" style="width:60px; height: 80px"></td>
          <td>${incident.sAlertDescription}</td>
        </tr>
      `
    })
    // ../img/alert.png
    // ${incident.ImageUrl}
    $tbody.html(htmltBody);
  } else{
    alert('No data');
  }

  $table.append($thead).append($tbody);
}

function formatToday() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  let mon = month < 10 ? `0${month}` : month;
  let d = day < 10 ? `0${day}` : day;
 
  $('#incidentDatetime').val(`${mon}/${d}/${year}`);

  showIncidentsData();
}