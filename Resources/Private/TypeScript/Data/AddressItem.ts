export default class AddressItem {

  public element: HTMLElement;

  public constructor(element: HTMLElement) {
    this.element = element;
  }

  public getMarkerNode(): HTMLElement {
    const elem = this.element.querySelector('.general') as HTMLInputElement;
    return elem;
  }

  public getPopupNode(): HTMLElement {
    const elem = this.element.querySelector('.address-item__popupcontent div') as HTMLInputElement;
    return elem;
  }
  
  public getMarkerHtml(): string {
    const elem = this.getMarkerNode();
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


}

