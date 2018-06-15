
showMap()

function renderMap(Guard, CheckPoints, Zone) {
  var mymap = L.map('mapid').setView([20.81715284, 106.77411238], 14);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    id: 'Techpro'
  }).addTo(mymap);

  var LeafIcon = L.Icon.extend({
    options: {
      iconSize: [15, 15]
    }
  });

  var Checked = new LeafIcon({
      iconUrl: '../img/Checked.png'
    }),
    Waiting = new LeafIcon({
      iconUrl: '../img/Waiting.png'
    }),
    None = new LeafIcon({
      iconUrl: '../img/None.png'
    }),
    Alert = new LeafIcon({
      iconUrl: '../img/Alert.png'
    }),
    Error = new LeafIcon({
      iconUrl: '../img/error.png'
    }),
    Guard = new LeafIcon({
      iconUrl: 'https://image.flaticon.com/icons/png/512/33/33622.png'
    });

  L.icon = function (options) {
    return new L.Icon(options);
  };


  for (var i = 0; i < Guard.length; i++) {
    var lon = Guard[i][0];
    var lat = Guard[i][1];
    var mes = Guard[i][2];
    var img = Guard[i][3];
    var on = Guard[i][4];
    if (on == 1) {
      L.marker([lon, lat], {
        icon: Guard
      }).bindTooltip(mes, {
        permanent: true,
        interactive: true
      }).addTo(mymap);
    } else if (on == 2) {
      L.marker([lon, lat], {
        icon: Alert
      }).bindTooltip(mes, {
        permanent: true,
        interactive: true
      }).addTo(mymap);
    }
  }


  for (var i = 0; i < CheckPoints.length; i++) {
    var lon = CheckPoints[i][0];
    var lat = CheckPoints[i][1];
    var message = CheckPoints[i][2];
    var imgurl = CheckPoints[i][3];
    var checkedpoint = CheckPoints[i][5];
    if (checkedpoint == 1) {
      message = message + "<br> <center><img src='" + imgurl +
        "' alt = '' style='width:200px;height:200px;'></center>";
      L.marker([lon, lat], {
        icon: Checked
      }).bindTooltip(message).addTo(mymap);
    } else if (checkedpoint == 2) {
      message = message + "<br> <center><img src='" + imgurl +
        "' alt = '' style='width:200px;height:200px;'></center>";
      L.marker([lon, lat], {
        icon: None
      }).bindTooltip(message).addTo(mymap);
    } else if (checkedpoint == 3) {
      L.marker([lon, lat], {
        icon: Waiting
      }).addTo(mymap);
    } else if (checkedpoint == 4) {
      message = message + "<br> <center><img src='" + imgurl +
        "' alt = '' style='width:200px;height:200px;'></center>";
      L.marker([lon, lat], {
        icon: Error
      }).bindTooltip(message).addTo(mymap);
    }
  }
}

async function showMap() {
  let Guard = await getGuardInfo();
  let CheckPoints = await getCheckPointInfo();
  let Zone = await getZoneInfo();

  renderMap(Guard, CheckPoints, Zone);
}

async function getGuardInfo() {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GPSGuardCurrent.php',
    method: 'post'
  });
  // console.log(typeof JSON.parse(data));
  return data;
}

async function getCheckPointInfo() {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/CheckPointCurrent.php',
    method: 'post'
  });
  return data;
}

async function getZoneInfo() {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/Zone.php',
    method: 'post'
  });
  return data;
}