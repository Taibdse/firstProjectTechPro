$(() => {

  //bind event click view to show event history
  $('#btnShowEventHistoryData').click(showEventHistoryData);
  // set up time default when page onload 
  formatToday();
  
})


//============ get and show events data ===============
async function showEventHistoryData() {
  let fromDate = $('#fromDateTime').val();
  let toDate = $('#toDateTime').val();
  let GuardID = $('#selectGuardName').val();
  if(GuardID == null) GuardID = 1;
  // {"GuardID: 1", "fromDate":"2018-06-05 16:50", "toDate":"2018-06-13 10:45"}

  if (checkTimeFormat(fromDate, toDate)) {
    let sentData = { GuardID, fromDate, toDate };

    let data = await getEventHistoryData(JSON.stringify(sentData));

    renderEventHistoryTable(data);
  }
}

async function getEventHistoryData(sentData) {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GetEventHistory.php',
    method: 'post',
    data: sentData
  });
  if (data) return JSON.parse(data);
  return null;
}

function renderEventHistoryTable(data) {
  let $table = $('#tblEventHistory');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">Code</th>
        <th class="trn">Zone</th>
        <th class="trn">Name</th>
        <th class="trn">Tiem Start</th>
        <th class="trn">Time End</th>
        <th class="trn">Complete</th>
        <th class="trn">Current</th>
        <th class="trn">Distance</th>
      </tr>
    `
  )
  if(data){
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
          <td><button class="btn btn-custom bg-main-color btn-custom" style="text-transform: capitalize; font-size: 0.85em" onClick = "showEventHistoryDetails('${event.sCheckingCode}')">Details</button></td>
        </tr>
      `
    })
    $tbody.html(htmltBody);
  }else{
    alert('No data');
  }

  $table.append($thead).append($tbody);
}
//====================================================


//================ get events of today =================
function formatToday() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  let hour = now.getHours();
  let minute = now.getMinutes();

  let mon = month < 10 ? `0${month}` : month;
  let d = day < 10 ? `0${day}` : day;
  let h = hour < 10 ? `0${hour}` : hour;
  let min = minute < 10 ? `0${minute}` : minute;

  $('#fromDateTime').val(`${year}-${mon}-${d} 00:00`);
  $('#toDateTime').val(`${year}-${mon}-${d} ${h}:${min}`);

  showEventHistoryData();
}

function checkTimeFormat(from, to) {
  let valid = true;
  let errMsg = '';
  if (from == '' || to == '') {
    valid = false;
    errMsg += `Time can not be missed\n`;
  } else {
    let fromDate = new Date(from).getTime();
    let toDate = new Date(to).getTime();
    if (fromDate >= toDate) {
      valid = false;
      errMsg += 'From date must be smaller than end date\n';
    }
  }
  if(!valid) alert(errMsg);
  return valid;
}
//====================================================


// ======= get and show events history details =======
async function getEventHistoryDetails(checkingCode){
  let sentDate = {CheckingCode:checkingCode};
  let data = await $.ajax({
    url:'http://115.79.27.219/tracking/api/GetEventHistoryDetail.php',
    method:'post',
    data:JSON.stringify(sentDate)
  });
  if(data) return JSON.parse(data);
  return null;
}

async function showEventHistoryDetails(checkingCode) {
  let data = await getEventHistoryDetails(checkingCode);
  renderTableEventHistoryDetails(data);
  $('#modalEventHistoryDetails').modal('show');
}

function renderTableEventHistoryDetails(data){

  let $table = $('#tblEventHistoryDetails');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">Name</th>
        <th class="trn">PointID</th>
        <th class="trn">Status</th>
        <th class="trn">DateTime</th>
        <th class="trn">KindCheck</th>
      </tr>
    `
  )
  if(data){
    let htmltBody = '';
    data.forEach(detail => {
      htmltBody +=
        `
        <tr>
          <td>${detail.sGuardName}</td>
          <td>${detail.iPointID}</td>
          <td>${detail.sStatus}</td>
          <td>${detail.dDateTimeHistory}</td>
          <td>${detail.KindCheck}</td>
        </tr>
      `
    })
    $tbody.html(htmltBody);
  }else{
    alert('No data');
  }

  $table.append($thead).append($tbody);
}
//=====================================================