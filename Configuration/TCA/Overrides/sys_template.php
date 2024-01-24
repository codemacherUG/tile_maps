<?php

defined('TYPO3') or die();

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

(static function ($extKey = 'tile_maps'): void {
    ExtensionManagementUtility::addStaticFile($extKey, "Configuration/TypoScript", "Tile Maps");
})();
