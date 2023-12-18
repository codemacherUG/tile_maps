..  include:: /Includes.rst.txt
..  highlight:: php

..  _customize-popup:

================
Customize Marker Popup
================

If you want to customize the output of the marker popup, you only need to overwrite the `PopupContent.html` partial.

Set the TS Constant plugin.tx_tilemaps.view.partialRootPath to your extension.

::

    plugin.tx_tilemaps.view.partialRootPath = EXT:my_ext/Resources/Private/Partials/


Create a PopupContent.html in EXT:my_ext/Resources/Private/Partials/

::

    <html xmlns:f="http://typo3.org/ns/TYPO3/CMS/Fluid/ViewHelpers" data-namespace-typo3-fluid="true">
        <f:render partial="address" arguments="{item:item, exportLatLng:1}" />
    <div class="general">
        <span property="name">{item.name}</span>
        <div property="address" typeof="PostalAddress">
            <span property="streetAddress">{item.address}</span>
            <div class="city">
                <span property="postalCode">{item.zip}</span>&nbsp;<span property="addressLocality">{item.city}</span>
            </div>
        </div>
        <span property="telephone">{item.phone}</span>
        <span>
            <f:link.email email="{item.email}" additionalAttributes="{property:'email'}" />
        </span>
        <f:if condition="{item.www}">
            <span>
            <f:link.external uri="{item.www}" target="_blank" additionalAttributes="{property:'url'}">{item.www}</f:link.external>
            </span>
        </f:if>
    </div>
