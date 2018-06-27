$(() => {
  $('#formUpdateGuard').submit((e) => {
    e.preventDefault();
    updateGuard();
  });
  $('#formInsertGuard').submit(e => {
    e.preventDefault();
    insertGuard();
  });
  $('#btnShowGuardInsertModal').click(showGuardModalInsert);

  showGuards();
})

async function insertGuard(){
  let name = $('#txtInsertGuardName').val();
  let phone = $('#txtInsertGuardPhone').val();
  let username = $('#txtInsertGuardUsername').val();
  let password = $('#txtInsertGuardPassword').val();
  if(checkValidation(name, username, phone, password)){
    let sentData = { sGuardNameIN: name, sGuardPhone: phone, sGuardUsername: username, sGuardPassword: password, iGuardIDIN: 0, bStatusIN: 1 };
    console.log(JSON.stringify(sentData));
    let response = await Service.insertGuard(sentData);
    console.log(response);
    $('#modalInsertGuard').modal('hide');
    $('#formInsertGuard')[0].reset;
    await swal({
      title: "Inactive successfully!",
      text: "",
      icon: "success",
      button: "Close!",
      timer: 1000
    });
    showGuards();
  }
}

function checkValidation(name, username, phone, password){
  let valid = true;
  let errMsg = '';
  if(name == null || name.trim() == ''){
    valid = false;
    errMsg += 'Name must be filled in\n'
  } 
  if(username == null || username.trim() == ''){
    valid = false;
    errMsg += 'Username must be filled in\n'
  } 
  if(!/^[0-9]+$/.test(phone)){
    valid = false;
    errMsg += 'Phone must be number\n'
  } 
  if(password.trim().length < 4){
    valid = false;
    errMsg += 'Password must be longer than 4\n'
  } 
  if(!valid){
    swal({
      title: "Invalid data",
      text: errMsg,
      icon: "error",
      button: "Close!",
    });
  }
  return valid;
}

async function updateGuard(){
  let id = $('#txtUpdateGuardID').val();
  let name = $('#txtUpdateGuardName').val();
  let phone = $('#txtUpdateGuardPhone').val();
  let username = $('#txtUpdateGuardUsername').val();

  let sentData = { sGuardNameIN: name, sGuardPhone: phone, sGuardUsername: username, sGuardPassword: 0, iGuardIDIN: id, bStatusIN: 2 };
  let response = await Service.updateGuard(sentData);
  console.log(response);
  await swal({
    title: "Updated successfully!",
    text: "",
    icon: "success",
    button: "Close!",
    timer: 1000
  });
  showGuards();
}

async function inActiveGuard(id){
  let sentData = { sGuardNameIN: 0, sGuardPhone: 0, sGuardUsername: 0, sGuardPassword: 0, iGuardIDIN: id, bStatusIN: 3 };
  let response = await Service.inActiveGuard(sentData);
  console.log(response);
  await swal({
    title: "Inactive successfully!",
    text: "",
    icon: "success",
    button: "Close!",
    timer: 1000
  });
  showGuards();
}

function renderGuardTable(guards){
  let $table = $('#tblGuards')
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">ID</th>
      <th class="trn">Name</th>
      <th class="trn">Phone</th>
      <th class="trn">Username</th>
      <th class="trn">Active</th>
    </tr>
  `
  )
  if (guards) {
    guards.forEach(guard => {
      const { iGuardID, sGuardName, sGuardPhone, sGuardUserName, bActive} = guard
      $tbody.append(`
        <tr>
          <td>${iGuardID}</td>
          <td>${sGuardName}</td>
          <td>${sGuardPhone}</td>
          <td>${sGuardUserName}</td>
          <td>${bActive}</td>
          <td>
            <button class="btn btn-custom bg-main-color btn-custom-small btnInactiveGuard">Inactive</button>
            <button class="btn btn-custom bg-main-color btn-custom-small btnShowUpdateGuardModal">Update</button>
            <button class="btn btn-custom bg-main-color btn-custom-small btnShowModalResetPassword">Reset Password</button>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btnInactiveGuard').last().click(() => {
          inActiveGuard(iGuardID);
      })
      $tbody.find('.btn.btnShowUpdateGuardModal').last().click(() => {
        showGuardModalUpdate(guard);
      })
      $tbody.find('.btn.btnShowModalResetPassword').last().click(() => {
        showGuardModalResetPass(guard);
      })
    })
  }

  $table.append($thead).append($tbody);

}

function showGuardModalResetPass(guard){
  const { iGuardID, sGuardName, sGuardPhone, sGuardUserName, bActive} = guard
}

function showGuardModalUpdate(guard){
  const { iGuardID, sGuardName, sGuardPhone, sGuardUserName, bActive} = guard
  $('#txtUpdateGuardID').val(iGuardID);
  $('#txtUpdateGuardPhone').val(sGuardPhone);
  $('#txtUpdateGuardName').val(sGuardName);
  $('#txtUpdateGuardUsername').val(sGuardUserName);
  $('#modalUpdateGuard').modal('show');
}

function showGuardModalInsert(){
  $('#modalInsertGuard').modal('show');
}

async function showGuards(){
  let guards = await Service.getPersonalGuardsInfo();
  renderGuardTable(guards);
}

