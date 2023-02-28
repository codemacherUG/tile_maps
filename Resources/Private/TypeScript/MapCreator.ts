import OpenLayerMap from "./MapProvider/OpenLayerMap";
import AddressItems from "./AddressItems";

class MapCreator {
  public constructor() {
    const elements = document.querySelectorAll('.frame-type-tilemaps_map');
    for(let i=0;i<elements.length;i++) {
      const container = elements[i] as HTMLElement;
      const mapElement = container.querySelector('.map') as HTMLElement;
      const addressItems = new AddressItems(container);
      const maps = new OpenLayerMap(mapElement);
      maps.addMarkers(addressItems);
    }
  }
}

export default new MapCreator();
