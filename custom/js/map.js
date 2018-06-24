
showMap()

function renderMap(Guard) {
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
    });
  var Waiting = new LeafIcon({
       iconUrl: '../img/Waiting.png'
    });
  var None = new LeafIcon({
       iconUrl: '../img/None.png'
    });
  var Alert = new LeafIcon({
       iconUrl: '../img/Alert.png'
    });
  var Error = new LeafIcon({
       iconUrl: '../img/error.png'
    });
  var Guard = new LeafIcon({
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
}

async function showMap() {
  let Guard = await getGuardInfo();

  renderMap(Guard);
}

async function getGuardInfo() {
  let data = await $.ajax({
    url: 'http://115.79.27.219/tracking/api/GPSGuardCurrent.php',
    method: 'post'
  });
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