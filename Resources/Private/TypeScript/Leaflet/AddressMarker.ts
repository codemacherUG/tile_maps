import L from "leaflet";
import AddressItem from "../Data/AddressItem";

export interface AddressMarkerOptions extends L.MarkerOptions {
    addressItem : AddressItem;
}

export default class AddressMarker extends L.Marker {
    options: AddressMarkerOptions;

    constructor(latLng: L.LatLngExpression, options?: AddressMarkerOptions) {
        super(latLng, options)
    }
}