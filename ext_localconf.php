<?php

defined('TYPO3') or die('Access denied.');

use Codemacher\TileMaps\Utils\PluginRegisterFacade;

(static function ($extKey = 'tile_maps'): void {
    PluginRegisterFacade::configureAllPlugins($extKey, 'Configuration/PluginRegistrations');
})();
