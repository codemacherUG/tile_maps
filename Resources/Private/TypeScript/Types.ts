import AddressItem from "./Data/AddressItem";

export enum HightlightTriggerReason {
  selected,
  mouseover,
  mouseout
}

export type onLocationUpdateCallBack = (lat: number | null, lng: number | null) => void;
export type onAddressItemHighlightCallBack = (type : HightlightTriggerReason,item: AddressItem) => void;