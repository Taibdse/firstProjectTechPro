const APP_DOMAIN = 'http://115.79.27.219/tracking/api/';

class Service {
  static async getAllZones() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetZone.php`,
      method: 'post',
    });
    let parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getEventsData() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetEvent.php`,
      method: 'post'
    });
    let parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getGuardsData() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetGuard.php`,
      method: 'post'
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getPointsDataOnZone(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetPointData.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getReportData(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}ReportGuard.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    })
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getIncidentsData(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetIncidentData.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getEventHistoryData(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetEventHistory.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getEventHistoryDetails(checkingCode) {
    let sentDate = {
      CheckingCode: checkingCode
    };
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetEventHistoryDetail.php`,
      method: 'post',
      data: JSON.stringify(sentDate)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getAssetsData(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetAssetData.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async updatePoint(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}UpdatePoint.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async inActivePoint(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}UpdatePoint.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async insertPoint(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}UpdatePoint.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async saveRoute(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}UpdateRoute.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async getRouteDetailsData(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetRouteDetailData.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async deleteRoute(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}UpdateRoute.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }
  
  static async updateRouteGuard(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}UpdateRouteGuard.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async getRoutesOnZone(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetRouteData.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async updateGuard(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}UpdateGuard.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async insertGuard(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}UpdateGuard.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async inActiveGuard(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}UpdateGuard.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async getPersonalGuardsInfo() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetGuardInformation.php`,
      method: 'post',
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getPersonalGuardsInfo() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}GetGuardInformation.php`,
      method: 'post',
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async sendMessageGuard(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}InsertMessage.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

}