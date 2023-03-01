export default class AddressItem {

  protected item: HTMLElement;

  public constructor(element: HTMLElement) {
    this.item = element;
  }

  public getLatitude(): number | null {
    const elem = this.item.querySelector('input[name="latitude"]') as HTMLInputElement;
    if (elem) return Number(elem.value);
    return null;
  }

  public getLongitude(): number | null {
    const elem = this.item.querySelector('input[name="longitude"]') as HTMLInputElement;
    if (elem) return Number(elem.value);
    return null;
  }

  private formatDistance(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000.0) + " km"
    } else if (value >= 100) {
      return Math.round(value) + " m"
    }
    return value.toFixed(1) + " m"

  };

  public setDistance(distance: number | null): void {
    let distanceElement = this.item.querySelector(".distance") as HTMLElement;
    if (distanceElement) {
      if(distance != null) {
        distanceElement.innerHTML = this.formatDistance(distance);
      } else {
        distanceElement.innerHTML = "-";
      }
    }
  }

}

