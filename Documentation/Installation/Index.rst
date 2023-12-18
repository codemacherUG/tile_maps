..  include:: /Includes.rst.txt

..  _installation:

============
Installation
============

Installation Type
=================

Composer
--------

You can install Tile Maps with the following shell command:

.. code-block:: bash

   composer req codemacher/tile_maps

Extensionmanager
----------------

If you want to install tile proxy traditionally with ExtensionManager, follow these steps:

#. Open ExtensionManager

#. Switch over to `Get Extensions`

#. Search for `tile_maps`

#. Install extension


Include TypoScript Template
===========================

You need to include at least the basic TypoScript provided by this extension.

Go to the module :guilabel:`Web > Template` and select your root page. It should already have a TypoScript template record. Switch to the view
:guilabel:`Info/Modify` and click on :guilabel:`Edit the whole template record`.

Switch to the tab :guilabel:`Includes` and add the following templates from the list on the right: :guilabel:`Tile Maps (tile_maps)`.

