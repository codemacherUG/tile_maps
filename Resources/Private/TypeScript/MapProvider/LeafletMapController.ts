import AddressItems from '../AddressItems';
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.locatecontrol";


export default class LeafletMapController {

  private markers: L.MarkerClusterGroup;
  private defaultMarkerIcon: L.Icon;
  private searchedLocationMarker: L.Marker;
  private map: L.Map;

  public constructor(element: HTMLElement) {

    const settings = JSON.parse(element.dataset.settings ?? "");
    const endpoint = element.dataset.endpoint;

    const bbox = settings.bbox.split(',').map(function (item: string) {
      return parseFloat(item);
    });

    const initialView = settings.initialView.split(',').map(function (item: string) {
      return parseFloat(item);
    });

    const bounds = L.latLngBounds(L.latLng(bbox[1], bbox[0]), L.latLng(bbox[3], bbox[2]));

    // Initialize the map
    this.map = L.map(element, {
      scrollWheelZoom: false,
      minZoom: parseInt(settings.minZoom ?? "0"),
      maxZoom: parseInt(settings.maxZoom ?? "18")
    });

    const endPointUrl = endpoint + '/?provider=osm&z={z}&x={x}&y={y}&s={s}';

    L.tileLayer(endPointUrl, {
      attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

    }).addTo(this.map);

    this.markers = L.markerClusterGroup();
    this.map.addLayer(this.markers);

    if (settings.setMaxBounds > 0) {
      this.map.setMaxBounds(bounds);
    }
    this.map.setView(L.latLng(initialView[1], initialView[0]), initialView[2]);

    if (settings.enableLocationDetectionButton > 0) {
      const locationControl = L.control.locate();
      locationControl.addTo(this.map);
    }


    this.defaultMarkerIcon = L.icon({
      iconRetinaUrl: settings.resourceUrl + 'marker-icon-2x.png',
      iconUrl: settings.resourceUrl + 'marker-icon.png',
      shadowUrl: settings.resourceUrl + 'marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });

    this.searchedLocationMarker =
      L.marker([0, 0], {
        icon: L.icon({
          iconRetinaUrl: settings.resourceUrl + 'marker-searched-icon-2x.png',
          iconUrl: settings.resourceUrl + 'marker-searched-icon.png',
          shadowUrl: settings.resourceUrl + 'marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41]
        })
      });

  }

  public addMarkers(addressItems: AddressItems): void {
    for (let i = 0; i < addressItems.items.length; i++) {
      let item = addressItems.items[i];
      if (item.getLatitude() != null && item.getLongitude() != null) {
        L.marker([item.getLatitude() ?? 0, item.getLongitude() ?? 0], { icon: this.defaultMarkerIcon }).addTo(this.markers);
      }
    }
  }

  public setSearchedPosition(lat: number, lng: number): void {
    const pos = L.latLng(lat, lng);
    this.map.setView(pos);
    this.searchedLocationMarker.setLatLng(pos);
    this.searchedLocationMarker.addTo(this.map);
  }

  public removeSearchedPosition() : void {
    this.searchedLocationMarker.remove();
  }

}
