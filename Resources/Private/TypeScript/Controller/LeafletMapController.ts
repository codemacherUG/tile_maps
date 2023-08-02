import AddressItem from '../Data/AddressItem';
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.locatecontrol";
import { onLocationUpdateCallBack, onAddressItemHighlightCallBack, HightlightTriggerReason } from '../Types';
import AddressMarker from '../Leaflet/AddressMarker';

export default class LeafletMapController {

  private markerLayer: L.FeatureGroup;
  private locationMarkerLayer: L.LayerGroup;
  private oneLocationMarker: L.Layer;
  private defaultMarkerIcon: L.Icon;
  private hightlightMarkerIcon: L.Icon;
  private searchedLocationMarker: L.Marker;
  private map: L.Map;
  private settings: any;
  private markerMap = new Map<AddressItem, L.Marker>();


  public onRefPositionMoved: onLocationUpdateCallBack;
  public onLocationUpdate: onLocationUpdateCallBack;
  public onAddressItemSelected: onAddressItemHighlightCallBack;

  public constructor(element: HTMLElement, onLocationFound: onLocationUpdateCallBack, onRefPositionMoved: onLocationUpdateCallBack, onAddressItemSelected: onAddressItemHighlightCallBack) {

    this.onLocationUpdate = onLocationFound;
    this.onAddressItemSelected = onAddressItemSelected;
    this.onRefPositionMoved = onRefPositionMoved;
    this.settings = JSON.parse(element.dataset.settings ?? "");
    const endpoint = element.dataset.endpoint;

    const bbox = this.settings.bbox.split(',').map(function (item: string) {
      return parseFloat(item);
    });

    const initialView = this.settings.initialView.split(',').map(function (item: string) {
      return parseFloat(item);
    });

    const bounds = L.latLngBounds(L.latLng(bbox[1], bbox[0]), L.latLng(bbox[3], bbox[2]));

    // Initialize the map
    this.map = L.map(element, {
      scrollWheelZoom: false,
      minZoom: parseInt(this.settings.minZoom ?? "0"),
      maxZoom: parseInt(this.settings.maxZoom ?? "18"),
      dragging: !L.Browser.mobile,
      touchZoom: true,
      tap: !L.Browser.mobile
    });

    const endPointUrl = endpoint + '/?provider=osm&z={z}&x={x}&y={y}&s={s}';

    L.tileLayer(endPointUrl, {
      attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

    }).addTo(this.map);

    if (this.settings.enableCluster > 0) {
      this.markerLayer = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
      });
    } else {
      this.markerLayer = L.featureGroup();
    }

    this.map.addLayer(this.markerLayer);
    this.locationMarkerLayer = new L.LayerGroup();

    if (this.settings.setMaxBounds > 0) {
      this.map.setMaxBounds(bounds);
    }
    this.map.setView(L.latLng(initialView[1], initialView[0]), initialView[2]);

    if (this.settings.enableLocationDetectionButton > 0) {
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
    if (this.settings.enableDistanceMarker > 0) {
      this.map.on('click', (e: any) => {
        this.onLocationUpdate(e.latlng.lat, e.latlng.lng);
        this.searchedLocationMarker.setLatLng(L.latLng(e.latlng.lat, e.latlng.lng)).addTo(this.map);
      });
    }

    this.map.on("locationfound", (e) => {
      // leaflet.locatecontrol add the marker also in this event => queue up
      setTimeout(() => {
        let markers = this.locationMarkerLayer.getLayers();
        if (markers.length > 0) {
          const marker = markers[0];
          if (marker != this.oneLocationMarker) {
            this.oneLocationMarker = markers[0];
            this.onLocationUpdate(e.latlng.lat, e.latlng.lng);
            this.searchedLocationMarker.setLatLng(L.latLng(e.latlng.lat, e.latlng.lng)).addTo(this.map);
            this.oneLocationMarker.on("click", (e) => this.markerClicked(e))
          }
        }
      }, 0);
    });

    this.defaultMarkerIcon = L.icon({
      iconRetinaUrl: this.settings.defaultMarkerIcon.iconName2x ? this.settings.resourceUrl + this.settings.defaultMarkerIcon.iconName2x : undefined,
      iconUrl: this.settings.resourceUrl + this.settings.defaultMarkerIcon.iconName,
      shadowUrl: this.settings.defaultMarkerIcon.shadowIconName ? this.settings.resourceUrl + this.settings.defaultMarkerIcon.shadowIconName : undefined,
      iconSize: this.stringToPoint(this.settings.defaultMarkerIcon.iconSize),
      iconAnchor: this.stringToPoint(this.settings.defaultMarkerIcon.iconAnchor),
      popupAnchor: this.stringToPoint(this.settings.defaultMarkerIcon.popupAnchor),
      tooltipAnchor: this.stringToPoint(this.settings.defaultMarkerIcon.tooltipAnchor),
      shadowSize: this.settings.defaultMarkerIcon.shadowSize ? this.stringToPoint(this.settings.defaultMarkerIcon.shadowSize) : undefined,
    });

    this.hightlightMarkerIcon = L.icon({
      iconRetinaUrl: this.settings.hightlightMarkerIcon.iconName2x ? this.settings.resourceUrl + this.settings.hightlightMarkerIcon.iconName2x : undefined,
      iconUrl: this.settings.resourceUrl + this.settings.hightlightMarkerIcon.iconName,
      shadowUrl: this.settings.hightlightMarkerIcon.shadowIconName ? this.settings.resourceUrl + this.settings.hightlightMarkerIcon.shadowIconName : undefined,
      iconSize: this.stringToPoint(this.settings.hightlightMarkerIcon.iconSize),
      iconAnchor: this.stringToPoint(this.settings.hightlightMarkerIcon.iconAnchor),
      popupAnchor: this.stringToPoint(this.settings.hightlightMarkerIcon.popupAnchor),
      tooltipAnchor: this.stringToPoint(this.settings.hightlightMarkerIcon.tooltipAnchor),
      shadowSize: this.settings.hightlightMarkerIcon.shadowSize ? this.stringToPoint(this.settings.defaultMarkerIcon.shadowSize) : undefined,
    });

    this.searchedLocationMarker =
      L.marker([0, 0], {
        draggable: true,
        icon: L.icon({
          iconRetinaUrl: this.settings.searchedLocationMarkerIcon.iconName2x ? this.settings.resourceUrl + this.settings.searchedLocationMarkerIcon.iconName2x : undefined,
          iconUrl: this.settings.resourceUrl + this.settings.searchedLocationMarkerIcon.iconName,
          shadowUrl: this.settings.searchedLocationMarkerIcon.shadowIconName ? this.settings.resourceUrl + this.settings.searchedLocationMarkerIcon.shadowIconName : undefined,
          iconSize: this.stringToPoint(this.settings.searchedLocationMarkerIcon.iconSize),
          iconAnchor: this.stringToPoint(this.settings.searchedLocationMarkerIcon.iconAnchor),
          popupAnchor: this.stringToPoint(this.settings.searchedLocationMarkerIcon.popupAnchor),
          tooltipAnchor: this.stringToPoint(this.settings.searchedLocationMarkerIcon.tooltipAnchor),
          shadowSize: this.settings.searchedLocationMarkerIcon.shadowSize ? this.stringToPoint(this.settings.defaultMarkerIcon.shadowSize) : undefined
        })
      }).on("click", (e: any) => { this.markerClicked(e); })
        .on('dragend', (event) => {
          var position = this.searchedLocationMarker.getLatLng();
          this.onRefPositionMoved(position.lat, position.lng)
        });

  }

  protected markerClicked(e: any): void {
    this.searchedLocationMarker.setLatLng(L.latLng(e.latlng.lat, e.latlng.lng)).addTo(this.map);
    this.onLocationUpdate(e.latlng.lat, e.latlng.lng);
  }


  public addMarkers(addressItems: Array<AddressItem>): void {
    for (let i = 0; i < addressItems.length; i++) {
      let item = addressItems[i];
      if (item.getLatitude() != null && item.getLongitude() != null) {

        const marker = new AddressMarker([item.getLatitude() ?? 0, item.getLongitude() ?? 0], {
          icon: this.defaultMarkerIcon,
          addressItem: item
        });

        if (this.settings.enableMarkerPopUp > 0) {
          marker.bindPopup(item.getPopupNode());
        }

        marker.addTo(this.markerLayer)
          .on("click", (e: any) => {
            this.onAddressItemSelected(HightlightTriggerReason.selected, e.sourceTarget.options.addressItem);
          })
          .on("mouseover", (e: any) => {
            marker.setIcon(this.hightlightMarkerIcon);
            this.onAddressItemSelected(HightlightTriggerReason.mouseover, e.sourceTarget.options.addressItem);
          })
          .on("mouseout", (e: any) => {
            marker.setIcon(this.defaultMarkerIcon);
            this.onAddressItemSelected(HightlightTriggerReason.mouseout, e.sourceTarget.options.addressItem);
          })
        this.markerMap.set(item, marker);
      }
    }

    if (this.settings.fitBounds > 0) {
      var bounds = this.markerLayer.getBounds();
      const fitBoundsPadding = this.settings.fitBoundsPadding.split(',').map(function (item: string) {
        return parseInt(item);
      });
      this.map.fitBounds(bounds,{padding: fitBoundsPadding, maxZoom: parseInt(this.settings.maxZoom ?? "18") });
    }

  }


  private stringToPoint(text: string): [number, number] | undefined {
    let parts = text.split(',');
    if (parts.length != 2) return undefined;
    return [parseFloat(parts[0]), parseFloat(parts[1])];
  }


  public setSearchedPosition(lat: number, lng: number): void {
    const pos = L.latLng(lat, lng);
    this.map.setView(pos);
    this.searchedLocationMarker.setLatLng(pos).addTo(this.map);

  }

  public removeSearchedPosition(): void {
    this.searchedLocationMarker.remove();
  }

  public select(hightlight: HightlightTriggerReason, addressItem: AddressItem): void {

    const marker = this.markerMap.get(addressItem);

    if (!marker) return;
    switch (hightlight) {
      case HightlightTriggerReason.selected:
        var latLngs = [marker.getLatLng()];
        var markerBounds = L.latLngBounds(latLngs);
        this.map.fitBounds(markerBounds, {
          maxZoom: 14
        });
        break;
      case HightlightTriggerReason.mouseover:
        this.markerLayer.removeLayer(marker);
        this.map.addLayer(marker);
        marker.setIcon(this.hightlightMarkerIcon);
        break;
      case HightlightTriggerReason.mouseout:
        this.map.removeLayer(marker);
        this.markerLayer.addLayer(marker);
        marker.setIcon(this.defaultMarkerIcon);
        break;

    }
  }

}
