import AddressItem from '../Data/AddressItem';
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.locatecontrol";
import { onLocationFoundCallBack } from '../Types';


export default class LeafletMapController {

  private markers: L.MarkerClusterGroup;
  private locationMarkerLayer: L.LayerGroup;
  private oneLocationMarker: L.Layer;
  private defaultMarkerIcon: L.Icon;
  private searchedLocationMarker: L.Marker;
  private map: L.Map;
  private onLocationFound: onLocationFoundCallBack;


  public constructor(element: HTMLElement, onLocationFound: onLocationFoundCallBack) {

    this.onLocationFound = onLocationFound;
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
    this.locationMarkerLayer = new L.LayerGroup();

    if (settings.setMaxBounds > 0) {
      this.map.setMaxBounds(bounds);
    }
    this.map.setView(L.latLng(initialView[1], initialView[0]), initialView[2]);

    if (settings.enableLocationDetectionButton > 0) {
      let TYPO3 = (window as any).TYPO3;
      L.control.locate({
        showPopup: false,
        layer: this.locationMarkerLayer,
        drawCircle: false,
        clickBehavior: {
          inView: "stop",
          outOfView: "stop",
          inViewNotFollowing: "inView"
        },
        strings: {
          title: TYPO3.lang["leaflet.locatecontrol.title"],
          metersUnit: TYPO3.lang["leaflet.locatecontrol.metersUnit"],
          feetUnit: TYPO3.lang["leaflet.locatecontrol.feetUnit"],
          popup: TYPO3.lang["leaflet.locatecontrol.popup"],
          outsideMapBoundsMsg: TYPO3.lang["leaflet.locatecontrol.outsideMapBoundsMsg"],
        },
      }).addTo(this.map);

    }
    this.map.on('click', (e: any) => {
      this.onLocationFound(e.latlng.lat, e.latlng.lng);
      this.searchedLocationMarker.setLatLng(L.latLng(e.latlng.lat, e.latlng.lng)).addTo(this.map);
    });

    this.map.on("locationfound", (e) => {
      // leaflet.locatecontrol add the marker also in this event => queue up
      setTimeout(() => {
        let markers = this.locationMarkerLayer.getLayers();
        if (markers.length > 0) {
          const marker = markers[0];
          if (marker != this.oneLocationMarker) {
            this.oneLocationMarker = markers[0];
            this.onLocationFound(e.latlng.lat, e.latlng.lng);
            this.searchedLocationMarker.setLatLng(L.latLng(e.latlng.lat, e.latlng.lng)).addTo(this.map);
            this.oneLocationMarker.on("click", (e) => this.markerClicked(e))
          }
        }
      }, 0);
    });

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
        draggable: true,
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
      }).on("click", (e: any) => { this.markerClicked(e); })
      .on('dragend', (event) => {
      var position = this.searchedLocationMarker.getLatLng();
      this.onLocationFound(position.lat, position.lng);
    });

  }

  protected markerClicked(e: any): void {
    this.searchedLocationMarker.setLatLng(L.latLng(e.latlng.lat, e.latlng.lng)).addTo(this.map);
    this.onLocationFound(e.latlng.lat, e.latlng.lng);
  }


  public addMarkers(addressItems: Array<AddressItem>): void {
    for (let i = 0; i < addressItems.length; i++) {
      let item = addressItems[i];
      if (item.getLatitude() != null && item.getLongitude() != null) {
        L.marker([item.getLatitude() ?? 0, item.getLongitude() ?? 0], { icon: this.defaultMarkerIcon }).addTo(this.markers);
      }
    }
  }

  public setSearchedPosition(lat: number, lng: number): void {
    const pos = L.latLng(lat, lng);
    this.map.setView(pos);
    this.searchedLocationMarker.setLatLng(pos).addTo(this.map);

  }

  public removeSearchedPosition(): void {
    this.searchedLocationMarker.remove();
  }

}
