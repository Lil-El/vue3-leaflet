<template>
  <div>
    <h2>雨水分布图Demo</h2>
    <div class="operate">
      <button id="show-cloud">显示云图</button>
      <button id="hide-cloud">隐藏云图</button>
      <label for="">&nbsp;&nbsp;&nbsp;未来雨水周期：</label>
      <button class="rain-btn" data-hour="24">24小时</button>
      <button class="rain-btn" data-hour="48">48小时</button>
      <button class="rain-btn" data-hour="72">72小时</button>
    </div>
    <div id="map" style="width: 100%; height: 700px"></div>
  </div>
</template>

<script>
import L from "leaflet";
import $ from "jquery";
export default {
  data() {
    return {
      rainLevel: {
        0: "小雨",
        2.5: "小雨",
        5: "小雨",
        10: "中雨",
        25: "大雨",
        50: "暴雨",
        100: "大暴雨",
        250: "特大暴雨",
      },
      imageBounds: [],
      infowin: null,
    };
  },
  mounted() {
    let mapboxUrl =
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
    let staellite = L.tileLayer(mapboxUrl, { id: "mapbox.satellite" });
    let streets = L.tileLayer(mapboxUrl, { id: "mapbox.streets" });
    // Map
    this.map = L.map("map", {
      center: [29.7, 119.3],
      zoom: 5,
      layers: [staellite, streets],
    });
    // Control
    let baseLayers = {
      影像图: staellite,
      街道图: streets,
    };
    L.control.layers(baseLayers).addTo(this.map);
    // Layer Group
    this.RainImgLayer = L.featureGroup([]).addTo(this.map);
    this.CloudImgLayer = L.featureGroup([]).addTo(this.map);
    //
    this.displayRainPublic(72);

    $("#hide-cloud").hide();
    $("#show-cloud").click(() => {
      this.displayCloud(1);
      $("#hide-cloud").show();
      $("#show-cloud").hide();
    });
    $("#hide-cloud").click(() => {
      this.hideCloudLayer();
      $("#hide-cloud").hide();
      $("#show-cloud").show();
    });

    $(".rain-btn").click((e) => {
      var target = e.target;
      var hour = $(target).attr("data-hour");
      this.displayRainPublic(hour);
    });
  },
  methods: {
    hideRainLayer() {
      this.map.removeLayer(this.RainImgLayer);
    },
    hideCloudLayer() {
      this.map.removeLayer(this.CloudImgLayer);
    },
    displayRainPublic(time) {
      $.ajax({
        type: "GET",
        url: "http://typhoon.zjwater.gov.cn/Api/LeastRain/" + time,
        dataType: "jsonp",
        jsonp: "callback",
        success: (res) => {
          /**
           * a:contours: "[{"symbol":"0","color":"164,245,140,255","latAndLong":[[28.99,123.661]...]}]
           */
          let countours = JSON.parse(res.contours); // 轮廓
          this.RainImgLayer.clearLayers();
          for (let i = 0; i < countours.length; i++) {
            let pos = [];
            let oneOfCountours = countours[i];
            for (let j = 0; j < oneOfCountours.latAndLong.length; j++) {
              pos.push([
                oneOfCountours.latAndLong[j][0],
                oneOfCountours.latAndLong[j][1],
              ]);
            }
            let color = countours[i].color.substring(
              0,
              countours[i].color.lastIndexOf(",")
            );
            let polygon = L.polygon(pos, {
              fillOpacity: 0.5,
              color: "rgb(" + color + ")",
              weight: 0,
            }).bindPopup(this.rainLevel[oneOfCountours.symbol]);
            polygon.addTo(this.RainImgLayer);
          }
          this.RainImgLayer.addTo(this.map);
        },
      });
    },
    displayCloud(a) {
      $.ajax({
        type: "GET",
        url: "http://typhoon.zjwater.gov.cn/Api/LeastCloud",
        dataType: "jsonp",
        jsonp: "callback",
        success: (b) => {
          var c, d, f, g, h, i, j;

          c = b[0].cloudFullPath;
          d = "";
          if ("1" == a) d = b[0].cloud1h;
          if ("3" == a) d = b[0].cloud3h;
          if ("6" == a) d = b[0].cloud6h;
          if ("30" == a) d = b[0].cloudname;
          b[0].cloudtime;
          f = b[0].diffTime;
          g = b[0].minLng;
          h = b[0].maxLng;
          i = b[0].minLat;
          j = b[0].maxLat;
          if (parseFloat(f) < 3) {
            this.map.removeLayer(this.CloudImgLayer);
            this.imageBounds = [
              [i, g],
              [j, h],
            ];
            this.CloudImgLayer = L.imageOverlay(c + "/" + d, this.imageBounds, {
              maxZoom: 11,
            });
            this.CloudImgLayer.addTo(this.map);
            this.map._panes.overlayPane.children[0].style.zIndex = "2";
            this.map._panes.overlayPane.children[1].style.zIndex = "-1";

            var d2 = `${d.substring(0, 4)}/${d.substring(4, 6)}/${d.substring(
              6,
              8
            )} ${d.substring(8, 10)}:${d.substring(10, 12)}`;
          }
        },
      });
    },
  },
};
</script>

<style>
</style>