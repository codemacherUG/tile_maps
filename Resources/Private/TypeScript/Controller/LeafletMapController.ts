import AddressItem from '../Data/AddressItem';
import L from "leaflet";
import "leaflet.markercluster";
import { onAddressItemSelectedCallBack, SelectedTriggerReason } from '../Data/Types';
import AddressMarker from '../Leaflet/AddressMarker';

export default class LeafletMapController {

  protected markerLayer: L.FeatureGroup;
  protected defaultMarkerIcon: L.Icon;
  protected hightlightMarkerIcon: L.Icon;
  protected map: L.Map;
  protected settings: any;
  protected markerMap = new Map<AddressItem, L.Marker>();

  public onAddressItemSelected: onAddressItemSelectedCallBack | undefined;

  public constructor(element: HTMLElement, 
    onAddressItemSelected: onAddressItemSelectedCallBack | undefined = undefined) {

    this.onAddressItemSelected = onAddressItemSelected;
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

    if (this.settings.setMaxBounds > 0) {
      this.map.setMaxBounds(bounds);
    }
    this.map.setView(L.latLng(initialView[1], initialView[0]), initialView[2]);

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
            if (this.onAddressItemSelected) this.onAddressItemSelected(SelectedTriggerReason.selected, e.sourceTarget.options.addressItem);
          })
          .on("mouseover", (e: any) => {
            marker.setIcon(this.hightlightMarkerIcon);
            if (this.onAddressItemSelected) this.onAddressItemSelected(SelectedTriggerReason.mouseover, e.sourceTarget.options.addressItem);
          })
          .on("mouseout", (e: any) => {
            marker.setIcon(this.defaultMarkerIcon);
            if (this.onAddressItemSelected) this.onAddressItemSelected(SelectedTriggerReason.mouseout, e.sourceTarget.options.addressItem);
          })
        this.markerMap.set(item, marker);
      }
    }

    if (this.settings.fitBounds > 0) {
      var bounds = this.markerLayer.getBounds();
      const fitBoundsPadding = this.settings.fitBoundsPadding.split(',').map(function (item: string) {
        return parseInt(item);
      });
      this.map.fitBounds(bounds, { padding: fitBoundsPadding, maxZoom: parseInt(this.settings.maxZoom ?? "18") });
    }

  }

  protected stringToPoint(text: string): [number, number] | undefined {
    let parts = text.split(',');
    if (parts.length != 2) return undefined;
    return [parseFloat(parts[0]), parseFloat(parts[1])];
  }

  public select(hightlight: SelectedTriggerReason, addressItem: AddressItem): void {

    const marker = this.markerMap.get(addressItem);

    if (!marker) return;
    switch (hightlight) {
      case SelectedTriggerReason.selected:
        var latLngs = [marker.getLatLng()];
        var markerBounds = L.latLngBounds(latLngs);
        this.map.fitBounds(markerBounds, {
          maxZoom: 14
        });
        break;
      case SelectedTriggerReason.mouseover:
        this.markerLayer.removeLayer(marker);
        this.map.addLayer(marker);
        marker.setIcon(this.hightlightMarkerIcon);
        break;
      case SelectedTriggerReason.mouseout:
        this.map.removeLayer(marker);
        this.markerLayer.addLayer(marker);
        marker.setIcon(this.defaultMarkerIcon);
        break;

    }
  }

}
