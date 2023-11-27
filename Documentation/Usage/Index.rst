..  include:: /Includes.rst.txt

..  _usage:

============
Usage
============

First, a Tile Proxy endpoint must be defined, follow the `instructions for Tile Proxy <https://docs.typo3.org/p/codemacher/tile_proxy/main/en-us/>`_.

The corresponding Tile Proxy endpoint must first be selected under Plugin Options.
The initial map area with zoom level can now be selected under "Inital center and zoomlevel".
To do this, simply move the map section to the appropriate position, including zoom.

Now all that remains is to select a source folder for markers, which must contain corresponding tt_address entries with geo-coordinates.

Additional settings
^^^^^^^^^^^^^^^^^^^^^^^^^

**Inital center and zoomlevel ( Format: Lng, Lat, Zoomlevel )**

Sets the initial map section in the format "<Longitude>, <Latitude>, <ZoomLevel>", alternatively this can be determined by the interactive map.

**Set the bounding box of the endpoint as maximum bounds of the map**

If this is active, the maximum map section is taken from the tile proxy endpoint.
This prevents the user from accessing another area outside the map.

**Sets a map view that contains the marker with the maximum zoom level possible.**

If this is active, the initial map section is determined by the bounding box of the markers.

**Minimal Zoomlevel**

Defines the minimum zoom level of the map.

**Maximum Zoomlevel**

Defines the maximum zoom level of the map.

**Enable marker popup on click**

If this option is active, a pop-up with address data is displayed, if you click on a marker.

**Cluster the markers**

If this option is active, a cluster layer is used for the markers. 

