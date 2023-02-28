<?php

defined('TYPO3') or die();

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

use Codemacher\TileMaps\Utils\PluginRegisterFacade;

(static function ($extKey = 'tile_maps'): void {
  PluginRegisterFacade::registerAllPlugins();
})();