import Map from 'ol/Map';
import View from 'ol/View';
import XYZSource from 'ol/source/XYZ';
import Raster from 'ol/source/Raster';
import Point from 'ol/geom/Point';
import Image from 'ol/layer/Image';
import Feature from 'ol/Feature';
import { transformExtent, fromLonLat } from 'ol/proj';
import AddressItems from '../AddressItems';
import { Cluster, OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
} from 'ol/style';
import {getCenter} from 'ol/extent';

export default class OpenLayerMap {

  private custerSource = new VectorSource;
  private map: Map;

  public constructor(element: HTMLElement) {

    const tileEndpoint = element.dataset.tileendpoint;
    const grayScale = element.dataset.grayscale === 'true';
    const bbox = element.dataset.bbox.split(',').map(function(item) {
      return parseFloat(item);
    });

    let extent = transformExtent(bbox,'EPSG:4326','EPSG:3857');

    this.map = new Map({
      layers: [
        this.buildMapLayer(tileEndpoint, grayScale),
        this.buildClusterLayer()
      ],
      target: element,
      view: new View({
        center:getCenter(extent),
        zoom: 14,
        minZoom: 0
      })
    });

  }

  public addMarkers(addressItems: AddressItems): void {
    for (let i = 0; i < addressItems.items.length; i++) {
      let item = addressItems.items[i];
      let coodinates = fromLonLat([item.getLongitude(), item.getLatitude()]);
      this.custerSource.addFeature(new Feature(new Point(coodinates)));
    }
  }

  protected buildClusterLayer(): VectorLayer<Cluster> {

    const clusterSource = new Cluster({
      distance: 40,
      minDistance: 20,
      source: this.custerSource,
    });
    let styleCache: Array<Style> = [];
    const clusters = new VectorLayer({
      source: clusterSource,
      style: function (feature) {
        const size = feature.get('features').length;
        let style = styleCache[size];
        if (!style) {
          let style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({
                color: '#fff',
              }),
              fill: new Fill({
                color: '#3399CC',
              }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({
                color: '#fff',
              }),
            }),
          });
          styleCache[size] = style;
        }
        return style;
      },
    });
    return clusters;
  }

  protected buildMapLayer(tileEndpoint: string, grayScale: boolean): TileLayer<XYZSource> | Image<Raster> {
    const osmSource = new XYZSource({
      attributions: '&#169; ' +
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> ' +
        'contributors.',
      urls: [
        tileEndpoint + '/?provider=osm&z={z}&x={x}&y={y}&s=a',
        tileEndpoint + '/?provider=osm&z={z}&x={x}&y={y}&s=b',
        tileEndpoint + '/?provider=osm&z={z}&x={x}&y={y}&s=c',
      ]
    });

    let mapLayer: TileLayer<XYZSource> | Image<Raster>;
    if (!grayScale) {
      mapLayer = new TileLayer({
        source: osmSource,
      });
    } else {
      let rasterSource = new Raster({
        sources: [osmSource],
        operation: function (pixels: [any][number], data) {
          let pixel = pixels[0];
          if (pixel.length >= 3) {
            let r = pixel[0];
            let g = pixel[1];
            let b = pixel[2];
            let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            pixel[0] = v; // Red
            pixel[1] = v; // Green
            pixel[2] = v; // Blue
            //pixel[3] = 255;
          }
          return pixel;
        }
      });

      mapLayer = new Image({
        source: rasterSource
      });
    }
    return mapLayer;
  }
}
