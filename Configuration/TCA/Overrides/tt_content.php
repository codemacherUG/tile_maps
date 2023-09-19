<?php

defined('TYPO3') or die();

use Codemacher\TileMaps\Utils\PluginRegisterFacade;

(static function ($extKey = 'tile_maps'): void {
  PluginRegisterFacade::registerAllPlugins();
})();