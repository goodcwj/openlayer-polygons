import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import GeometryCollection from "ol/geom/GeometryCollection";
import MultiPoint from "ol/geom/MultiPoint";
import Circle from "ol/geom/Circle";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

var styleFunction = (feature, resolution) => {
  return [
    new Style({
      stroke: new Stroke({
        color: "blue",
        width: 3
      }),
      fill: new Fill({
        color: "rgba(0, 0, 255, 0.1)"
      })
    }),
    new Style({
      fill: new Fill({
        color: "orange"
      }),
      geometry: function(feature) {
        // return the coordinates of the first ring of the polygon
        var geometries = [];
        feature
          .getGeometry()
          .getCoordinates()[0]
          .slice(0, -1)
          .forEach(function(coordinate) {
            geometries.push(new Circle(coordinate, 500000));
          });
        return new GeometryCollection(geometries);
      }
    })
  ];
};

var geojsonObject = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: "EPSG:3857"
    }
  },
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6], [-3e6, 6e6], [-5e6, 6e6]]
        ]
      }
    }
  ]
};

var source = new VectorSource({
  features: new GeoJSON().readFeatures(geojsonObject)
});

var layer = new VectorLayer({
  source: source,
  style: styleFunction
});

var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    layer
  ],
  target: "map",
  view: new View({
    center: [0, 3000000],
    zoom: 2
  })
});
