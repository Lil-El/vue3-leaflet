<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import L from "leaflet";
import data from "./data.json";
import Viewer from "viewerjs";
export default {
  setup() {
    console.log("1setup");
    onMounted(() => {
      console.log("2mounted:hook");
    });
  },
  mounted() {
    console.log("3mounted");
    this.initMap();
    this.fetchData();
  },
  methods: {
    initMap() {
      console.log("4ablum");
      let centerPoint = [35.63452, 109.132287];

      // 创建地图
      this.map = L.map("map", {
        center: centerPoint,
        zoom: 5,
        minZoom: 1,
        maxZoom: 16,
        attributionControl: !1,
      });

      // 创建图层
      let mapServerUrl =
        "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}";
      L.tileLayer(mapServerUrl, {
        opacity: 1,
        zIndex: 0,
      }).addTo(this.map);

      // 自定义版权信息（简单的html字符串）
      let attr = L.control.attribution();
      attr.addAttribution("旅游地图相册Demo——那些我去过的城市");
      attr.addAttribution(
        '<a href="http://giscafer.com" target="_blank">@giscafer</a>'
      );
      attr.addTo(this.map);
    },
    fetchData() {
      setTimeout(() => {
        this.drawFooter(data);
      }, 500);
    },
    drawFooter({ rows: data }) {
      for (let i = 0; i < data.length; i++) {
        let p = data[i];
        let point = [p.latitude - 0, p.longitude - 0];
        L.marker(point, {
          icon: L.icon({
            iconUrl: "./travel/footer.png",
            iconSize: [28, 28],
            iconAnchor: [10, 10],
          }),
        })
          .addTo(this.map)
          // 每个marker动态获取remark等信息，绑定弹窗
          .bindPopup(
            "<h3>" +
              p["city"] +
              "</h3>" +
              p["date"] +
              "<br>" +
              p["remark"] +
              "<br>" +
              this.generatePicHtml(p.imgs)
          );
      }
    },
    /**
     * 动态拼接html字符串
     * @param {string} cityName 城市名称
     * @param {*} imgs 足迹点数据中的imgs数组
     */
    generatePicHtml(imgs) {
      imgs = imgs || [];
      // 动态拼接html字符串
      var _html = `<div id="galley"><ul class="pictures" onclick=viewPic()">`;
      // 循环图片数组，动态拼接项目的相对地址url
      for (var i = 0; i < imgs.length; i++) {
        var url = "./travel/pictures/" + imgs[i];
        var display = 'style="display:inline-block"';
        // 这里
        if (i > 5) {
          display = 'style="display:none"';
        }
        _html +=
          "<li " +
          display +
          '><img data-original="' +
          url +
          '" src="' +
          url +
          '" alt="图片预览"></li>';
      }
      _html += "</ul></div></div>";

      return _html;
    },
    /**
     * veiwerjs预览大图
     * 暂无法使用，同时应该放到全局上
     */
    viewPic() {
      var galley = document.getElementById("galley");
      var viewer = new Viewer(galley, {
        url: "data-original",
        hidden: function () {
          viewer.destroy();
        },
      });
      viewer.show();
    },
  },
};
</script>

<style lang="scss" >
#banner,
#map {
  width: 100%;
  height: 500px;
  background-color: #fff;
}

#legend,
#map {
  position: absolute;
}

#banner,
#legend {
  background-repeat: no-repeat;
}

body,
html {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.fontfix {
  font-family: Arial, "微软雅黑", "Hiragino Sans GB", "新宋体", sans-serif;
  -webkit-font-smoothing: antialiased;
}

.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#banner {
  height: 0;
  background-position: 0 0;
}

#mapcontainer {
  position: relative;
  width: 100%;
  height: 100%;
}

.leaflet-container {
  background: #fff;
}

.pictures {
  margin: 0;
  margin-top: 10px;
  padding: 0;
  list-style: none;
  max-width: 30rem;
  display: flex;
  justify-content: flex-start;
  white-space: pre-wrap;
  flex-wrap: wrap;
}

.pictures::after {
  display: table;
  content: " ";
  clear: both;
}

.pictures > li {
  margin: 0 5px 2px 0;
  border: 1px solid transparent;
  overflow: hidden;
}

.pictures > li > img {
  width: 100%;
  cursor: -webkit-zoom-in;
  cursor: zoom-in;
}

.viewer-download {
  color: #fff;
  font-family: FontAwesome;
  font-size: 0.75rem;
  line-height: 1.5rem;
  text-align: center;
}

.viewer-download::before {
  content: "\f019";
}

ul.pictures li img {
  width: 80px;
  height: 80px;
}
</style>