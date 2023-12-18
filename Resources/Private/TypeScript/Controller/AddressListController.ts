import AddressItem from "../Data/AddressItem";

export default class AddressListController {

  public items: Array<AddressItem>;
  private parentContainer: HTMLElement;

  public constructor(parentContainer: HTMLElement) {
    this.items = new Array<AddressItem>();
    this.parentContainer = parentContainer;
    const elements = this.parentContainer.querySelectorAll('.address-item');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      const item = new AddressItem(element);
      this.items.push(item);
    }
  }
}

