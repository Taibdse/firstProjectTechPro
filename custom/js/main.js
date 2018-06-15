$('.datepicker').datepicker();

$('.datetimepicker').datetimepicker({
  format: 'yyyy-mm-dd hh:ii'
})


$(() => {
  showGuardInfo();
  showEventsInfo();

  changeLanguage();
  changeLanguage();
})

async function getGuardsData() {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GetGuard.php',
    method: 'post'
  });
  return JSON.parse(data);
}

async function showGuardInfo() {
  let data = await getGuardsData();
  if (data) renderGuardTable(data);
}

function renderGuardTable(data) {
  console.log(data);
  let $table = $('#tblGuard')
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">Guard ID</th>
      <th class="trn">Guard Name</th>
      <th class="trn">Last Site Visted</th>
      <th class="trn">Speed</th>
      
    </tr>
  `
  )

  let htmltBody = '';
  data.forEach(guard => {
    htmltBody +=
      `
      <tr>
        <td>${guard.iGuardId}</td>
        <td>${guard.sGuardName}</td>
        <td>${guard.dLastUpdateTime}</td>
        <td>${guard.dSpeedCurrent}</td>
      </tr>
    `
  })
  $tbody.html(htmltBody);

  $table.append($thead).append($tbody);
}

async function getEvensData() {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GetEvent.php',
    method: 'post'
  });

  return JSON.parse(data);
}

async function showEventsInfo() {
  let data = await getEvensData();
  if (data) renderEventsTable(data);
}

function renderEventsTable(data) {
  let $table = $('#tblEvents')
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">CheckingCode</th>
      <th class="trn">ZoneName</th>
      <th class="trn">GuardName</th>
      <th class="trn">DateTimeStart</th>
      <th class="trn">DateTimeEnd</th>
      <th class="trn">TimeComplete</th>
      <th class="trn">TimeCurrent</th>
      <th class="trn">Distance</th>
    </tr>
  `
  )

  let htmltBody = '';
  data.forEach(event => {
    htmltBody +=
      `
      <tr>
        <td>${event.sCheckingCode}</td>
        <td>${event.sZoneName}</td>
        <td>${event.sGuardName}</td>
        <td>${event.dDateTimeStart}</td>
        <td>${event.dDateTimeEnd}</td>
        <td>${event.iTimeComplete}</td>
        <td>${event.iTimeCurrent}</td>
        <td>${event.dDistance}</td>
      </tr>
    `
  })
  $tbody.html(htmltBody);

  $table.append($thead).append($tbody);
}