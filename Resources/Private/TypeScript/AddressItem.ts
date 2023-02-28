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

}

