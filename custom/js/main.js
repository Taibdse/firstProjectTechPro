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
  html += '<option value="0">All</option>';
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
      <th class="trn">Status</th>
    </tr>
  `
  )
  if (data) {
    data.forEach(guard => {
      const {iGuardId, sGuardName, dLastUpdateTime, dSpeedCurrent, bOnline} = guard
      let className = '';
      if(bOnline == 'SOS') className = 'red-text';
      if(bOnline == 'Online') className = 'green-text';
      $tbody.append(`
        <tr>
          <td>${iGuardId}</td>
          <td>${sGuardName}</td>
          <td>${dLastUpdateTime}</td>
          <td>${dSpeedCurrent}</td>
          <td class="${className}">${bOnline}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
}

async function getEventsData() {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GetEvent.php',
    method: 'post'
  });
  if (data.indexOf('<') > -1) return null;
  
  return JSON.parse(data);
}

function renderEventsTable(data) {
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
      <th class="trn">Date</th>
      <th class="trn">Start</th>
      <th class="trn">End</th>
      <th class="trn">Complete</th>
      <th class="trn">Current</th>
      <th class="trn">Distance</th>
    </tr>
  `
  )
  if (data) {
    data.forEach(event => {
      $tbody.append(`
        <tr>
          <td>${event.sCheckingCode}</td>
          <td>${event.sZoneName}</td>
          <td>${event.sGuardName}</td>
          <td>${event.dDateTimeIntinial}</td>
          <td>${event.dDateTimeStart}</td>
          <td>${event.dDateTimeEnd}</td>
          <td>${event.iTimeComplete}</td>
          <td>${event.iTimeCurrent}</td>
          <td>${event.dDistance}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
}

async function showEventsInfo() {
  let data = await getEventsData();
  if (data) renderEventsTable(data);
}

function formatToday() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  let mon = month < 10 ? `0${month}` : month;
  let d = day < 10 ? `0${day}` : day;
  
  return `${mon}/${d}/${year}`;
}

function changeFormatDateTime(time){
  let arr = time.split('/');
  let y = arr[2];
  let d = arr[1];
  let m = arr[0];
  return `${y}-${m}-${d}`;
}
