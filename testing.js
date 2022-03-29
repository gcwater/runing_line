
#tooltip {
  overflow: auto;
  z-index: 99;
  position: absolute;
  padding: 10px;
  border-radius: 15px;
  background-color: rgba(0,0,0,0.75);
  color: #fff;
  width: 310px; 
  height: 150px;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}
<script>
  require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Feature"
], function(ArcGISMap, MapView, FeatureLayer, Feature) {
  const tooltip = document.getElementById("tooltip");

  const layer = new FeatureLayer({
    portalItem: {
      id: "04482d030fd7430f9c35382b457c605d"
    },
    outFields: ["*"],
    popupEnabled: false
  });

  const map = new ArcGISMap({
    layers: [layer],
    basemap: "gray-vector"
  });
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-95.4, 29.4],
          zoom: 10
  });

  const featureWidget = new Feature({ view, container: tooltip });
  
  let layerView;
  
  view.whenLayerView(layer).then(result => layerView = result);

  view.on("pointer-move", event => {
    const { x, y } = event;
    view.hitTest(event).then(({ results }) => {
      if (layerView) {
        layerView.effect = null;
      }
      if (results.length) {
        tooltip.style.display = "block";
        tooltip.style.top = `${y - 175}px`;
        tooltip.style.left = `${x - 310/2}px`;
        const g = results[0].graphic;
        if (g.geometry) {
          const oid = g.attributes.OBJECTID;
          featureWidget.graphic = g;
          if (layerView) {
            layerView.effect = {
              filter: {
                where: `OBJECTID = ${oid}`
              },
              excludedEffect: "opacity(20%) saturate(30%)",
              // includedEffect: "sepia(50%)"
            };
          }
        } else {
          tooltip.style.display = "none";
        }
      } else {
        tooltip.style.display = "none";
      }
    });
  });
});

    </script>
