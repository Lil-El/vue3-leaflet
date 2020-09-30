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
    const state = reactive({
      name: "台风路线",
    });
    let url =
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";
    let satellite = L.tileLayer(url, {
      id: "mapbox.satellite",
      attribution: "YXD",
    });
    let streets = L.tileLayer(url, {
      id: "mapbox.streets",
      attribution: "YXD",
    });
    // 加载影像图和街道图
    let map;
    let lineLayer;
    let marker;
    // 获取台风信息，详细见./data.js文件数据
    let land = typhoonTestData[0]["land"][0];
    let typhoonIcon = L.icon({
      iconUrl: img,
      iconSize: [28, 28],
      iconAnchor: [10, 10],
    });
    return {
      state,
      url,
      satellite,
      streets,
      map,
      lineLayer,
      marker,
      land,
      typhoonIcon,
    };
  },
  mounted() {
    this.handleMounted();
  },
  methods: {
    dataHandler() {
      // 获取台风坐标点数据对象
      let forecast = typhoonTestData[0]["points"];
      // 定义折线点数据
      let polylinePoints = [];
      // 循环拼接数据[[经度，纬度],[经度,纬度]] 的格式
      for (let i = 0; i < forecast.length; i++) {
        let p = forecast[i];
        polylinePoints.push([Number(p["lat"]), Number(p["lng"])]);
      }
      return polylinePoints;
    },
    animateDrawLine(allpoints) {
      // allpoints 是上边介绍的数据转换的结果
      let length = allpoints.length;
      // 定义用来存放递增元素的经纬度数据
      let drawPoints = [];
      let count = 0;
      // 定时器100ms，动态的塞入坐标数据
      this.timer = setInterval(() => {
        if (count < length) {
          // 清除之前绘制的折线图层
          if (this.lineLayer && count !== length) {
            this.map.removeLayer(this.lineLayer);
            this.lineLayer = null;
          }
          // 清除marker图层
          if (this.marker && count !== length) {
            this.map.removeLayer(this.marker);
            this.marker = null;
          }
          drawPoints.push(allpoints[count++]);
          // 最新数据点drawPoints绘制折线
          this.lineLayer = L.polyline(drawPoints, { color: "blue" }).addTo(
            this.map
          );
          // 根据最新数组最后一个点绘制marker
          if (count === length) {
            this.marker && this.map.removeLayer(this.marker);
            // 如果是台风最后一个点，则自动popup弹窗
            this.marker = L.marker(drawPoints[length - 1], {
              icon: this.typhoonIcon,
            })
              .addTo(this.map)
              .bindPopup(
                "<b>" +
                  typhoonTestData[0]["name"] +
                  "</b><br>" +
                  this.land["info"] +
                  "<br>" +
                  this.land["landtime"] +
                  "<br>经度：" +
                  this.land["lng"] +
                  "<br>纬度：" +
                  this.land["lat"] +
                  "<br>强度：" +
                  this.land["strong"] +
                  "<br><br><b>Author：giscafer<b>"
              )
              .openPopup();
          } else {
            this.marker = L.marker(drawPoints[count - 1], {
              icon: this.typhoonIcon,
            }).addTo(this.map);
          }
        } else {
          // 取完数据后清楚定时器
          clearInterval(this.timer);
        }
      }, 100);
    },
    handleMounted() {
      this.map = L.map("map", {
        center: [18.7, 119.3],
        zoom: 5,
        layers: [this.satellite, this.streets],
      });
      let baseLayers = {
        影像图: this.satellite,
        街道图: this.streets,
      };
      L.control.layers(this.baseLayers).addTo(this.map);
      //  数据转换
      let allpoints = this.dataHandler();
      // 直接展示
      // let polyline = L.polyline(allpoints, { color: "blue" }).addTo(map);
      // map.fitBounds(polyline.getBounds());
      // 动态移动

      this.animateDrawLine(allpoints);
    },
  },
};
</script>

<style lang="scss">
#map {
  width: 100%;
  height: 500px;
}
</style>
