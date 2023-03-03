
import $ from "jquery";
import "select2";
import {onLocationUpdateCallBack} from '../Types';

export default class GeoSearchController {

  private geosearchselect : JQuery;

  public constructor(element: HTMLElement, onLocationFound: onLocationUpdateCallBack) {
    this.geosearchselect = $("[name=geo-search-select]", element);
    const endpoint = element.dataset.endpoint;

    this.geosearchselect.select2({
      minimumInputLength: 3,
      allowClear: true,
      placeholder: '-',
      ajax: {
        delay: 1000, 
        url: endpoint,
        dataType: 'json',
        data: function (params) {
          var query = {
            q: params.term,
            provider: 'osm',
            apitype: 'search',
            format: 'json',
            limit: 40,
            addressdetails: 1,
            'accept-language': 'de-DE'
          }
          return query;
        },
        processResults: function (data) {
          let results = [];
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            results.push({
              id: item.place_id,
              text: item['display_name'],
              item: item

            })
          }
          return {
            results: results
          };
        }
      }
    });
    $(document).on('select2:open', () => {
      const result = document.querySelector('.select2-search__field') as HTMLElement;
      if(result) result.focus();
    });
    this.geosearchselect.on('select2:select', function (e) {
      var data = e.params.data as any;
      onLocationFound(data.item.lat,data.item.lon);
    });
    this.geosearchselect.on('select2:clear', function (e) {
      onLocationFound(null,null);
    });
  }

  public clearSelectedLocation() {
    this.geosearchselect.val("").trigger("change");
  }

}
