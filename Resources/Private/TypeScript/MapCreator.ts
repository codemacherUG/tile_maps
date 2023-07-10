import $ from "jquery";
import LeafletMapController from "./Controller/LeafletMapController";
import GeoSearchController from "./Controller/GeoSearchController";
import AddressListController from "./Controller/AddressListController";
import FilterController from "./Controller/FilterController";
import { FilterMap, HightlightTriggerReason } from "./Types";
import AddressItem from "./Data/AddressItem";

class MapCreator {
  protected valuesInArray<T>(arrayA: T[], arrayB: T[]): boolean {
    return arrayA.every(value => arrayB.includes(value));
  }

  public constructor() {
    const elements = document.querySelectorAll('.frame-type-tilemaps_map');
    for (let i = 0; i < elements.length; i++) {
      const container = elements[i] as HTMLElement;
      const mapElement = container.querySelector('.map') as HTMLElement;
      const addressList = new AddressListController(container);
      const maps = new LeafletMapController(mapElement,
        (lat: number | null, lng: number | null) => addressList.calculateDistanceToLocation(lat, lng),
        (lat: number | null, lng: number | null) => addressList.calculateDistanceToLocation(lat, lng),
        (type: HightlightTriggerReason, item: AddressItem) => addressList.select(type, item));

      maps.onRefPositionMoved = (lat: number | null, lng: number | null) => {
        addressList.calculateDistanceToLocation(lat, lng);
        addressList.scrollToTop();
      };

      addressList.setOnAddressItemSelected((type: HightlightTriggerReason, item: AddressItem) => maps.select(type, item));

      const geoSearchElement = container.querySelector('.geo-search') as HTMLElement;
      if (geoSearchElement) {
        const geoSearch = new GeoSearchController(geoSearchElement, (lat: number | null, lng: number | null) => {
          if (lat == null || lng == null) {
            maps.removeSearchedPosition();
          } else {
            maps.setSearchedPosition(lat as number, lng as number);
            addressList.calculateDistanceToLocation(lat as number, lng as number);
          }
        });
        maps.onRefPositionMoved = (lat: number | null, lng: number | null) => {
          geoSearch.clearSelectedLocation();
          addressList.calculateDistanceToLocation(lat, lng);
        };
      }
      const filterElement = container.querySelector('.filter') as HTMLElement;
      if (filterElement) {
        const filter = new FilterController(filterElement, (filters: FilterMap) => {
          for (let i = 0; i < addressList.items.length; i++) {
            const addressItem = addressList.items[i];
            let element = addressItem.element;
            addressItem.setVisibility(true);
            for (const [filterName, filterValueList] of filters.entries()) {

              if (filterValueList && filterValueList.length > 0) {
                let valueArray = (element.dataset[filterName] ?? "").split(',');
                if (!this.valuesInArray(filterValueList, valueArray)) {
                  addressItem.setVisibility(false);
                }
              }
            }
          }
          addressList.refreshCounter();
          addressList.scrollToTop();

        });
        filter.init();
      }

      maps.addMarkers(addressList.items);
    }
  }
}

export default new MapCreator();
