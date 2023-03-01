import LeafletMapController from "./MapProvider/LeafletMapController";
import GeoSearchController from "./GeoSearchController";
import AddressItems from "./AddressItems";

class MapCreator {
  public constructor() {
    const elements = document.querySelectorAll('.frame-type-tilemaps_map');
    for (let i = 0; i < elements.length; i++) {
      const container = elements[i] as HTMLElement;
      const mapElement = container.querySelector('.map') as HTMLElement;
      const addressItems = new AddressItems(container);
      const maps = new LeafletMapController(mapElement);
      const geoSearchElement = container.querySelector('.geo-search') as HTMLElement;
      if (geoSearchElement) {
        const geoSearch = new GeoSearchController(geoSearchElement, (lat: number | null, lng: number | null) => {
          if (lat == null || lng == null) {
            maps.removeSearchedPosition();
          } else {
            maps.setSearchedPosition(lat as number, lng as number);
          }
        });
      }
      maps.addMarkers(addressItems);
    }
  }
}

export default new MapCreator();
