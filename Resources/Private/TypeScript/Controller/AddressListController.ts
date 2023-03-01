import AddressItem from "../Data/AddressItem";
import L from "leaflet";

export default class AddressListController {

  public items : Array<AddressItem>;

  public constructor(parentContainer: HTMLElement) {
    this.items = new Array<AddressItem>();
    const elements = parentContainer.querySelectorAll('.address-item');
    for(let i=0;i<elements.length;i++) {
      this.items.push(new AddressItem(elements[i] as HTMLElement));
    }
  }

  public calculateDistanceToLocation(lat:number,lng:number) : void {
    let refPosition = L.latLng(lat, lng);
    for(let i=0;i<this.items.length;i++) {
      let item = this.items[i];
      let itemPosition = L.latLng(item.getLatitude() ?? 0, item.getLongitude() ?? 0);
      item.setDistance(itemPosition.distanceTo(refPosition));
    }
  }

  public clearDistance() : void {
    for(let i=0;i<this.items.length;i++) {
      let item = this.items[i];
      item.setDistance(null);
    }
  }
}

