var param = {};
window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page).then(menu.close.bind(menu));
};

document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'period') {
    page.querySelector('#push-period-0').onclick = function() {
      param.period = 0;
      param.periodText = '日帰り';
      document.querySelector('#myNavigator').pushPage('keyword.html');
    };
    page.querySelector('#push-period-1').onclick = function() {
      param.period = 1;
      param.periodText = '1泊2日';
      document.querySelector('#myNavigator').pushPage('keyword.html');
    };
    page.querySelector('#push-period-2').onclick = function() {
      param.period = 2;
      param.periodText = '2泊3日';
      document.querySelector('#myNavigator').pushPage('keyword.html');
    };
    page.querySelector('#push-period-3').onclick = function() {
      param.period = 3;
      param.periodText = '3泊4日';
      document.querySelector('#myNavigator').pushPage('keyword.html');
    };
    page.querySelector('#push-period-4').onclick = function() {
      param.period = 4;
      param.periodText = '4泊5日';
      document.querySelector('#myNavigator').pushPage('keyword.html');
    };
  } else if (page.id === 'keyword') {
    page.querySelector('#push-keyword-all').onclick = function() {
      param.keyword = 'すべて';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
    page.querySelector('#push-keyword-gourmet').onclick = function() {
      param.keyword = 'グルメ';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
    page.querySelector('#push-keyword-photo').onclick = function() {
      param.keyword = '写真';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
    page.querySelector('#push-keyword-healing').onclick = function() {
      param.keyword = '癒し';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
    page.querySelector('#push-keyword-adventure').onclick = function() {
      param.keyword = '冒険';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
    page.querySelector('#push-keyword-season').onclick = function() {
      param.keyword = '季節';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
  } else if (page.id === 'siori') {
    page.querySelector('ons-toolbar .center').innerHTML = param.periodText
        + "、" + param.keyword + "の旅";
    clickMakeSiori();
  }
});

document.addEventListener('show', function(event) {
  var page = event.target;

  if (page.id === 'period') {
  } else if (page.id === 'keyword') {
  } else if (page.id === 'siori') {
    var toolbarHeight = $('ons-toolbar').height();
    var tabHeight = $('ons-tab').height();
    var sioriHeight = $('#siori').height();
    $('#canvas').height(sioriHeight - tabHeight - toolbarHeight);
  }
});

//document.addEventListener('prechange', function(event) {
//  var tab = event.index;
//  if (tab === 0) {
//    // > 地図の場合
//    console.log('地図');
//  } else if (tab === 1) {
//    // > しおりの場合
//    console.log('しおり');
//  }
//});
//
//document.addEventListener('postchange', function(event) {
//  var tab = event.index;
//  if (tab === 0) {
//    // > 地図の場合
//    console.log('地図');
//  } else if (tab === 1) {
//    // > しおりの場合
//    console.log('しおり');
//  }
//});

var ymap = null;
var startLat = 35.161089;
var startLng = 136.882396;
var latlngStart = new Y.LatLng(startLat, startLng);
var oldLatLng = {};
var rect = {
  "min" : {
    "lat" : startLat,
    "lng" : startLng
  },
  "max" : {
    "lat" : startLat,
    "lng" : startLng
  }
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
  // 取得成功した場合
  function(position) {
    startLat = position.coords.latitude;
    startLng = position.coords.longitude;
    latlngStart = null;
    latlngStart = new Y.LatLng(startLat, startLng);
    rect = {
      "min" : {
        "lat" : startLat,
        "lng" : startLng
      },
      "max" : {
        "lat" : startLat,
        "lng" : startLng
      }
    };
  });
}

// MAP初期化
function initMap() {
  $('#canvas').html("");
  $('#canvas').css('opacity', 0);
  ymap = null;

  $('#list').html("");

  rect = {
    "min" : {
      "lat" : startLat,
      "lng" : startLng
    },
    "max" : {
      "lat" : startLat,
      "lng" : startLng
    }
  };
}

// しおり作成クリック
function clickMakeSiori() {
  initMap();

  var vLat = startLat;
  var vLng = startLng;
  $.getJSON("https://www.livlog.xyz/matatavi/getTourspot", {
    "lat" : vLat,
    "lng" : vLng,
    "nights" : param.period,
    "keywords" : param.keyword,
  }, function(data, status) {
    console.log(data);
    $('#now-making').hide();

    // 地図アニメーションスタート
    $('#canvas').css('opacity', 1);
    setTimeout(startMapAnimation(data.points), 1000);
  });
}

// 地図アニメーション開始
function startMapAnimation(data) {
  ymap = new Y.Map("canvas");
  ymap.drawMap(latlngStart, 9, Y.LayerSetId.NORMAL);
  ymap.addControl(new Y.LayerSetControl());
  ymap.addControl(new Y.ScaleControl());
  ymap.addControl(new Y.SliderZoomControlVertical());
  ymap.addFeature(new Y.Marker(latlngStart));
  oldLatLng = latlngStart;

//  makeSioriPoint(-1, data);
  setTimeout(nextMapAnimation(0, data), 1000);

}
// 地図アニメーション次のポイント
function nextMapAnimation(count, data) {
  console.log("count:" + count);
  setTimeout(function() {
    var p = latlngStart;
    var name = "GOAL"
    if (count < data.length) {
      p = new Y.LatLng(data[count].lat, data[count].lng);
      name = data[count].name1;
    }

    ymap.panTo(p, true);
    ymap.addFeature(new Y.Label(p, name));
    ymap.addFeature(new Y.Marker(p));

    var style = new Y.Style("ffa500", 8, 0.5);
    var latlngs = [ oldLatLng, p ];
    var polyline = new Y.Polyline(latlngs, {
      strokeStyle : style
    });
    ymap.addFeature(polyline);

    oldLatLng = p;

    if (p.lat() < rect.min.lat)
      rect.min.lat = p.lat();
    else if (p.lat() > rect.max.lat)
      rect.max.lat = p.lat();
    if (p.lng() < rect.min.lng)
      rect.min.lng = p.lng();
    else if (p.lng() > rect.max.lng)
      rect.max.lng = p.lng();

//    makeSioriPoint(count, data);

    if (count + 1 <= data.length) {
      nextMapAnimation(count + 1, data);
    } else {
      zoomMapRect(); // ズームを全体に設定
      makeSioriAll(data);
    }
  }, 1000);
}

// しおりポイント表示
//function makeSioriPoint(count, data) {
//  if (count < 0) {
//    var d = {
//      "name1" : "START",
//      "descs" : "",
//      "lat" : startLat,
//      "lng" : startLng
//    };
//    elemPoint(d, "keiro0");
//  } else if (count < data.length) {
//    elemPoint(data[count], "keiro" + (count + 1));
//  } else if (count == data.length) {
//    var d = {
//      "name1" : "GOAL",
//      "descs" : "",
//      "lat" : startLat,
//      "lng" : startLng
//    };
//    elemPoint(d, "goal");
//  }
//}

// マップを全体表示できるズームに
function zoomMapRect() {
  var bnds = new Y.LatLngBounds(new Y.LatLng(rect.min.lat, rect.min.lng),
      new Y.LatLng(rect.max.lat, rect.max.lng));

  var zoom = ymap.getBoundsZoomLevel(bnds);

  console.log("zoom = " + zoom);
  ymap.setZoom(zoom, true, bnds.getCenter(), true);
}

function makeSioriAll(data) {

  var timeline = $('.main-timeline');
  timeline.empty();

  var oldDay = 0;
  for (var i = 0; i < data.length; i++) {
    printProperties(data[i]);

    var day = 0;
    var half = '';
    if (param.period <= 1) {
      day = Math.floor((i / 2) + 1);
      if (oldDay == day) {
        half = '後半';
      } else {
        half = '前半';
      }
    } else {
      day = i + 1;
    }

    var searchUrl = 'https://www.google.co.jp/search?q='
                  + data[i].pref
                  + data[i].city
                  + data[i].street
                  + ' '
                  + data[i].name1

    var mapUrl = 'https://www.google.com/maps/search/'
                  + data[i].pref
                  + data[i].city
                  + data[i].street
                  + '　'
                  + data[i].name1

    var html = '';
    html += '<div class="timeline">';
    html += '<div class="timeline-icon"></div>';
    if (i % 2 == 0) {
      html += '<div class="timeline-content">';
    } else {
      html += '<div class="timeline-content right">';
    }
    html += '<span class="date">' + day + '日目 ' + half + ' </span>';
    html += '<h4 class="title">' + data[i].name1 + '</h4>';
    html += '<p class="description">';
    if (data[i].descs.length > 0) {
      html += data[i].descs[0];
    }
    html += '</p>';
    html += '<a href="' + searchUrl + '" '
    html += 'class="fab" style="background-color: #6379F3;" target="_blank"><img src="img/icons8-google-50.png" width="30" style="margin: 12px;"></a>';
    html += '&nbsp;&nbsp;';
    html += '<a href="' + mapUrl + '" '
    html += 'class="fab" style="background-color: #E04540;" target="_blank"><img src="img/icons8-google-maps-50.png" width="30" style="margin: 12px;"></a>';
    html += '</div>';
    html += '</div>';
    timeline.append(html);
    oldDay = day;
  }
}

//function makeSioriAll(data) {
//  // for (var i = 0; i < data.length; i++) {
//  // elemPoint(data[i].name1, data[i].descs, "keiro" + (i + 1));
//  // }
//  // elemPoint("到着", "", "goal");
//
//  for (var i = 0; i < data.length; i++) {
//    var nameFrom = "出発";
//    if (i > 0)
//      nameFrom = data[i - 1].name1;
//    var nameTo = data[i].name1;
//    var id = "keiro" + i;
//
//    var latlng = [ {
//      "lat" : startLat,
//      "lng" : startLng
//    }, {
//      "lat" : data[i].lat,
//      "lng" : data[i].lng
//    } ];
//    if (i > 0) {
//      latlng[0].lat = data[i - 1].lat;
//      latlng[0].lng = data[i - 1].lng;
//    }
//
//    resultApp[i] = new expGuiCoursePlain(document.getElementById(id));
//    resultApp[i].setConfigure("key", accessKey);
//    resultApp[i].setConfigure("ssl", true);
//    resultApp[i].setConfigure("from", nameFrom);
//    resultApp[i].setConfigure("to", nameTo);
//
//    searchRun(resultApp[i], latlng);
//
//  }
//
//  var i = data.length;
//  var nameFrom = data[i - 1].name1;
//  var nameTo = "到着";
//  var id = "keiro" + i;
//  var latlng = [ {
//    "lat" : data[i - 1].lat,
//    "lng" : data[i - 1].lng
//  }, {
//    "lat" : startLat,
//    "lng" : startLng
//  } ];
//  resultApp[i] = new expGuiCoursePlain(document.getElementById(id));
//  resultApp[i].setConfigure("key", accessKey);
//  resultApp[i].setConfigure("ssl", true);
//  resultApp[i].setConfigure("from", nameFrom);
//  resultApp[i].setConfigure("to", nameTo);
//  searchRun(resultApp[i], latlng);
//
//}

//function elemPoint(data, id) {
//  var s_id = "'#s_" + id + "'";
//  $('#siori').append(
//      '<div class = "point" > ' + elemNameBar(s_id, data)
//          + '<section id="s_' + id + '" class="desc_box">'
//          + '<div class = "desc" > ' + data.descs + ' </div>'
//          + '<div id = "' + id + '">' + id + '</div>' + '</section>'
//          + '</div>');
//}

//function elemNameBar(s_id, data) {
//  var s = '<div class="name-bar">';
//  console.log(s_id);
//  if (s_id != "'#s_keiro0'" && s_id != "'#s_goal'") {
//    s += '<a class="map-btn" href="https://www.google.co.jp/search?q='
//        + data.pref + data.city + '+' + data.name1
//        + '" target="_blank"><img src="img/icons8-google-50.png"/></a>'
//  }
//  s += '<h3 class = "name" onclick="clickName(' + s_id + ')" > ' + data.name1
//      + '</h3>';
//  if (s_id != "'#s_keiro0'" && s_id != "'#s_goal'") {
//    s += '<a class="map-btn" href="https://www.google.com/maps/search/'
//        + data.pref
//        + data.city
//        + data.street
//        + '　'
//        + data.name1
//        + '" target="_blank"><img src="img/icons8-google-maps-50.png"/></a>';
//  }
//  s += '</div>';
//
//  return s;
//}

function clickName(id) {
  console.log($(id).css("max-height"));

  if ($(id).css("max-height") != "0px") {
    $(id).css("max-height", 0);
  } else {
    $(id).css("max-height", 10000);
  }
}

/**
 * オブジェクトの中身を表示
 * @param obj
 */
function printProperties(obj) {
    var properties = '';
    for (var prop in obj){
        properties += prop + '=' + obj[prop] + '\n';
    }
    console.log(properties);
}
