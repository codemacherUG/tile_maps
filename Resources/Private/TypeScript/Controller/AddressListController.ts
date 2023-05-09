import AddressItem from "../Data/AddressItem";
import L from "leaflet";
import { HightlightTriggerReason, onAddressItemHighlightCallBack } from "../Types";

export default class AddressListController {

  public items: Array<AddressItem>;
  private onAddressItemSelected: onAddressItemHighlightCallBack;
  private counterElement: HTMLElement;
  private location: L.LatLng | null;

  public constructor(parentContainer: HTMLElement,) {
    this.items = new Array<AddressItem>();
    this.location = null;
    this.counterElement = parentContainer.querySelector('.address-items__header .numof .number') as HTMLElement;
    const elements = parentContainer.querySelectorAll('.address-item');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      const item = new AddressItem(element);
      this.items.push(item);
      element.addEventListener("click", (e: any) => {
        this.onAddressItemSelected(HightlightTriggerReason.selected, item);
      })
      element.addEventListener("mouseover", (e: any) => {
        this.onAddressItemSelected(HightlightTriggerReason.mouseover, item);
      })
      element.addEventListener("mouseout", (e: any) => {
        this.onAddressItemSelected(HightlightTriggerReason.mouseout, item);
      })

    }
  }

  public setOnAddressItemSelected(onAddressItemSelected: onAddressItemHighlightCallBack): void {
    this.onAddressItemSelected = onAddressItemSelected;
  }

  public calculateDistanceToLocation(lat: number | null, lng: number | null): void {
    this.setLocation(lat, lng);
    this._calculateDistanceToLocation();
  }

  private setLocation(lat: number | null, lng: number | null): void {
    if (lat === null || lng === null) {
      this.location = null;
    } else {
      this.location = L.latLng(lat, lng);
    }
  }

  private _calculateDistanceToLocation(): void {
    if (this.location === null) {
      this.clearDistance();
      return;
    }
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      let itemPosition = L.latLng(item.getLatitude() ?? 0, item.getLongitude() ?? 0);
      item.setDistance(itemPosition.distanceTo(this.location));
    }
    this.sort();
  }

  public clearDistance(): void {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      item.setDistance(null);
    }
  }

  protected sort() {

    this.items.sort((a, b) => {
      return a.getDistance() - b.getDistance();
    });

    for (var i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      let parentNode = item.element.parentNode;
      if (parentNode) {
        parentNode.appendChild(item.element);
      }
    }
    if (this.items.length > 0) {
      let item = this.items[0];
      let parentNode = item.element.parentElement;
      if (parentNode) {
        parentNode.scrollTo(0, 0);
      }
    }
  }

  public select(hightlight: HightlightTriggerReason, addressItem: AddressItem): void {
    switch (hightlight) {
      case HightlightTriggerReason.selected:
        addressItem.element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        break;
      case HightlightTriggerReason.mouseover:
        addressItem.element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        addressItem.element.classList.add("hover");
        break;
      case HightlightTriggerReason.mouseout:
        addressItem.element.classList.remove("hover");
        break;

    }
  }

  public refreshCounter(): void {
    if (this.counterElement) {
      this.counterElement.innerHTML = this.countVisible().toString();
    }
  }

  protected countVisible(): number {
    let count = 0;
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      if (item.getVisibility()) {
        count++;
      }
    }
    return count;
  }


}

