import LeafletMapController from "./Controller/LeafletMapController";
import GeoSearchController from "./Controller/GeoSearchController";
import AddressListController from "./Controller/AddressListController";

class MapCreator {
  public constructor() {
    const elements = document.querySelectorAll('.frame-type-tilemaps_map');
    for (let i = 0; i < elements.length; i++) {
      const container = elements[i] as HTMLElement;
      const mapElement = container.querySelector('.map') as HTMLElement;
      const addressList = new AddressListController(container);
      const maps = new LeafletMapController(mapElement, (lat: number | null, lng: number | null) => {
        if (lat == null || lng == null) {
          addressList.clearDistance();
        } else {
          addressList.calculateDistanceToLocation(lat as number, lng as number);
        }
      });
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
      }
      maps.addMarkers(addressList.items);
    }
  }
}

export default new MapCreator();
