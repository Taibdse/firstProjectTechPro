$('.datepicker').datepicker();

$('.datetimepicker').datetimepicker({
  format: 'yyyy-mm-dd hh:ii'
})

$(() => {

  showGuardInfo();
  showEventsInfo();

})

async function getGuardsData() {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GetGuard.php',
    method: 'post'
  });
  if (data) return JSON.parse(data);
  return null;
}

async function showGuardInfo() {
  let data = await getGuardsData();
  renderGuardTable(data);
  renderJcombobox(data);
}

function renderJcombobox(data) {
  let html = '';
  if (data) {
    data.forEach(guard => {
      html += `<option value="${guard.iGuardId}">${guard.sGuardName}</option>`
    })
  }
  $('#selectGuardName').html(html);
}

function renderGuardTable(data) {
  let $table = $('#tblGuard')
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">ID</th>
      <th class="trn">Name</th>
      <th class="trn">Last Visted</th>
      <th class="trn">Speed</th>
    </tr>
  `
  )
  if (data) {
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
  }

  $table.append($thead).append($tbody);
}

async function getEvensData() {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GetEvent.php',
    method: 'post'
  });
  if (data.indexOf('<') > -1) return null;

  return JSON.parse(data);
}

async function showEventsInfo() {
  let data = await getEvensData();
  if (data) renderEventHistoryTable(data);
}

function renderEventHistoryTable(data) {
  let $table = $('#tblEvents')
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">Code</th>
      <th class="trn">Zone</th>
      <th class="trn">Name</th>
      <th class="trn">TimeStart</th>
      <th class="trn">TimeEnd</th>
      <th class="trn">Complete</th>
      <th class="trn">Current</th>
      <th class="trn">Distance</th>
    </tr>
  `
  )
  if (data) {
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
  }

  $table.append($thead).append($tbody);
}