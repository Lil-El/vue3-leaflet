<template>
  <div>
    <h1>{{ state.name }}</h1>
    <div id="map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import typhoonTestData from "./data";
import { onMounted, reactive } from "vue";
import img from "@/assets/typhoon.png";
export default {
  setup() {
    onMounted(handleMounted);
    return { state };
  },
};

const state = reactive({
  name: "台风路线",
});
let url =
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
let satellite = L.tileLayer(url, {
  id: "mapbox.satellite",
  attribution: "YXD",
});
let streets = L.tileLayer(url, { id: "mapbox.streets", attribution: "YXD" });
// 加载影像图和街道图
let map;
let lineLayer;
let marker;
let typhoonIcon = L.icon({
  iconUrl: img,
  iconSize: [28, 28],
  iconAnchor: [10, 10],
});

function dataHandler() {
  // 获取台风坐标点数据对象
  var forecast = typhoonTestData[0]["points"];
  // 定义折线点数据
  var polylinePoints = [];
  // 循环拼接数据[[经度，纬度],[经度,纬度]] 的格式
  for (var i = 0; i < forecast.length; i++) {
    var p = forecast[i];
    polylinePoints.push([Number(p["lat"]), Number(p["lng"])]);
  }
  return polylinePoints;
}

function animateDrawLine(allpoints) {
  // allpoints 是上边介绍的数据转换的结果
  var length = allpoints.length;
  // 定义用来存放递增元素的经纬度数据
  var drawPoints = [];
  var count = 0;
  // 定时器100ms，动态的塞入坐标数据
  var timer = setInterval(function () {
    if (count < length) {
      // 清除之前绘制的折线图层
      if (lineLayer && count !== length) {
        map.removeLayer(lineLayer);
        lineLayer = null;
      }
      // 清除marker图层
      if (marker && count !== length) {
        map.removeLayer(marker);
        marker = null;
      }
      drawPoints.push(allpoints[count++]);
      // 最新数据点drawPoints绘制折线
      lineLayer = L.polyline(drawPoints, { color: "blue" }).addTo(map);
      // 根据最新数组最后一个点绘制marker
      if (count === length) {
        map.removeLayer(marker);
        // 如果是台风最后一个点，则自动popup弹窗
        marker = L.marker(drawPoints[length - 1], { icon: typhoonIcon })
          .addTo(map)
          .bindPopup(
            "<b>" +
              typhoonTestData[0]["name"] +
              "</b><br>" +
              land["info"] +
              "<br>" +
              land["landtime"] +
              "<br>经度：" +
              land["lng"] +
              "<br>纬度：" +
              land["lat"] +
              "<br>强度：" +
              land["strong"] +
              "<br><br><b>Author：giscafer<b>"
          )
          .openPopup();
      } else {
        marker = L.marker(drawPoints[count - 1], { icon: typhoonIcon }).addTo(
          map
        );
      }
    } else {
      // 取完数据后清楚定时器
      clearInterval(timer);
    }
  }, 100);
}

function handleMounted() {
  map = L.map("map", {
    center: [18.7, 119.3],
    zoom: 5,
    layers: [satellite, streets],
  });
  let baseLayers = {
    影像图: satellite,
    街道图: streets,
  };
  L.control.layers(baseLayers).addTo(map);
  //  数据转换
  var allpoints = dataHandler();
  // 直接展示
  // let polyline = L.polyline(allpoints, { color: "blue" }).addTo(map);
  // map.fitBounds(polyline.getBounds());
  // 动态移动

  animateDrawLine(allpoints);
}
</script>

<style lang="scss">
#map {
  width: 100%;
  height: 500px;
}
</style>
