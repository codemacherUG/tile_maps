import LeafletMapController from "./Controller/LeafletMapController";
import AddressListController from "./Controller/AddressListController";

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
      const maps = new LeafletMapController(mapElement);
      maps.addMarkers(addressList.items);
    }
  }
}

export default new MapCreator();
