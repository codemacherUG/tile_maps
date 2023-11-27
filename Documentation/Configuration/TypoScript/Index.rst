.. include:: /Includes.rst.txt


..  _typoScript:

==========
TypoScript
==========

To make adjustments to the output of markers, for example, you can use the following settings in your own extension.

view
====

templateRootPaths
-----------------

Default: `EXT:tile_maps/Resources/Private/Templates/`

You can override our templates with TypoScript, but you can also use the constant plugin.tx_tilemaps.view.templateRootPath.

partialRootPaths
----------------

Default: `EXT:tile_maps/Resources/Private/Partials/`

You can override our templates with TypoScript, but you can also use the constant plugin.tx_tilemaps.view.partialRootPath.

layoutsRootPaths
----------------

Default: `EXT:tile_maps/Resources/Private/Layouts/`

You can override our templates with TypoScript, but you can also use the constant plugin.tx_tilemaps.view.layoutRootPath.

settings
====

iconPath
----------------

Default: `EXT:tile_maps/Resources/Public/Icons/`

Directory path in which the marker icons must be located. 

defaultMarkerIcon
----------------

Default: 
::
  defaultMarkerIcon {
    iconName = marker-icon.png
    iconName2x = marker-icon-2x.png
    shadowIconName = marker-shadow.png
    iconSize = 25, 41
    iconAnchor = 12, 41
    popupAnchor = 1, -34
    tooltipAnchor =  16, -28
    shadowSize = 41, 41
  }

Defines the representation of a marker.
This corresponds to the maker definition of Leaflet.
You can find more information here: `<https://leafletjs.com/examples/custom-icons/>`


hightlightMarkerIcon
----------------

Default: 
::
  hightlightMarkerIcon {
    iconName = marker-highlight-icon.png
    iconName2x = marker-highlight-icon-2x.png
    shadowIconName = marker-highlight-shadow.png		
    iconSize = 25, 41
    iconAnchor = 12, 41
    popupAnchor = 1, -34
    tooltipAnchor = 16, -28
    shadowSize = 41, 41
  }

Defines the representation of a highlighted marker. This corresponds to the maker definition of Leaflet.
You can find more information here `<https://leafletjs.com/examples/custom-icons/>`