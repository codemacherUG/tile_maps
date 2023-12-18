<?php
defined('TYPO3') or die('Access denied.');

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

use Codemacher\TileMaps\Domain\Model\Plugin;
use Codemacher\TileMaps\Utils\PluginRegisterFacade;
use Codemacher\TileMaps\Controller\MapController;

(static function ($extKey = 'tile_maps'): void {

  ExtensionManagementUtility::addPageTSConfig("@import \"EXT:$extKey/Configuration/TSConfig/config.tsconfig\"");

  PluginRegisterFacade::definePlugin(new Plugin(
    'TileMaps',
    'Map',
  ))
    ->setIconFileName("map.svg")
    ->addShowItemConfig([
      '--palette--;;headers',
      'pi_flexform',
      'pages'
    ])
    ->setControllerActions([MapController::class => "display"])
    ->addCustomConfig([
      'columnsOverrides' => [
        'pages' => [
          'label' => "LLL:EXT:tile_maps/Resources/Private/Language/locallang_be.xlf:content_element.map.pages"
         ],
      ]
    ]
  );

  PluginRegisterFacade::configureAllPlugins();
})();
