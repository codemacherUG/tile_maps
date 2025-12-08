<?php

use Codemacher\TileMaps\Controller\MapController;
use Codemacher\TileMaps\Domain\Model\Plugin;
use Codemacher\TileMaps\Utils\PluginRegisterFacade;

PluginRegisterFacade::definePlugin(new Plugin(
    'TileMaps',
    'Map',
))
    ->setIconFileName("map.svg")
    ->addShowItemConfig([
      '--palette--;;headers',
      'pi_flexform',
      'pages',
      'recursive'
    ])
    ->setControllerActions([MapController::class => "display"])
    ->addCustomConfig(
        [
      'columnsOverrides' => [
        'pages' => [
          'label' => "LLL:EXT:tile_maps/Resources/Private/Language/locallang_be.xlf:content_element.map.pages"
         ],
      ]
    ]
    );
