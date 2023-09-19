import AddressItem from "./Data/AddressItem";

export enum SelectedTriggerReason {
  selected,
  mouseover,
  mouseout
}

export type FilterMap = Map<string, string[]>;
export type onAddressItemSelectedCallBack = (type : SelectedTriggerReason,item: AddressItem) => void;