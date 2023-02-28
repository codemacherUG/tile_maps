import AddressItem from "./AddressItem";

export default class AddressItems {

  public items : Array<AddressItem>;

  public constructor(parentContainer: HTMLElement) {
    this.items = new Array<AddressItem>();
    const elements = parentContainer.querySelectorAll('.address-item');
    for(let i=0;i<elements.length;i++) {
      this.items.push(new AddressItem(elements[i] as HTMLElement));
    }
    console.log(this.items);
  }
}

