import $ from "jquery";
import { FilterMap } from "../Types";

export type onFilterChangeCallBack = (filters: FilterMap) => void;

export default class FilterController {
  protected element: HTMLElement;
  protected doFilter: onFilterChangeCallBack;

  public constructor(element: HTMLElement, doFilter: onFilterChangeCallBack) {
    this.element = element;
    this.doFilter = doFilter;
    const $inputs = $('input', element);
    $inputs.on('change', () => { this.updateFilter() });
  }

  protected updateFilter() {
    let filters = new Map<string, string[]>();
    $('input[type=radio]:checked, input[type=checkbox]:checked, input[type=text]', this.element).each((index, input) => {
      const $input = $(input);
      const inputName = $input.attr('name');
      const inputValue = $input.val();
      if(inputValue == undefined) return;
      let value : string[];
      if(inputValue instanceof Array<string>) {
        value = inputValue;
      } else {
        value = [inputValue.toString()];
      }
       
      if (inputName && inputValue) {
          value = [...value,...(filters.get(inputName) ?? [])];
        filters.set(inputName, value);
      }
    });
    this.doFilter(filters);    
  }

  public init() {
    this.updateFilter();
  }
}
