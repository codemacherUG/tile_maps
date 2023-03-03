export default class AddressItem {

  public element: HTMLElement;

  public constructor(element: HTMLElement) {
    this.element = element;
  }

  public getMarkerHtml(): string {
    const elem = this.element.querySelector('.general') as HTMLInputElement;
    if (elem) return elem.innerHTML;
    return "?";
  }

  public getLatitude(): number | null {
    const elem = this.element.querySelector('input[name="latitude"]') as HTMLInputElement;
    if (elem) return Number(elem.value);
    return null;
  }

  public getLongitude(): number | null {
    const elem = this.element.querySelector('input[name="longitude"]') as HTMLInputElement;
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
    let distanceElement = this.element.querySelector(".distance") as HTMLElement;
    this.element.dataset.distance = distance ? distance.toString() : "";
    if (distanceElement) {
      if (distance != null) {
        distanceElement.innerHTML = this.formatDistance(distance);
      } else {
        distanceElement.innerHTML = "-";
      }
    }
  }

  public getDistance(): number {
    return parseFloat(this.element.dataset.distance ?? "");
  }

}

