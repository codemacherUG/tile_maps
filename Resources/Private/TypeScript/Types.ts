import AddressItem from "./Data/AddressItem";

export enum SelectedTriggerReason {
  selected,
  mouseover,
  mouseout
}

export type FilterMap = Map<string, string[]>;

export type onLocationUpdateCallBack = (lat: number | null, lng: number | null) => void;
export type onAddressItemSelectedCallBack = (type : SelectedTriggerReason,item: AddressItem) => void;