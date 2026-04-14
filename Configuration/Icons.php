<?php

declare(strict_types=1);

use Codemacher\TileMaps\Utils\PluginRegisterFacade;
use TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider;

$extKey = 'tile_maps';

$icons = PluginRegisterFacade::getIcons();

return [
    'smart-plugin-default-icon-ce' => [
        'provider' => SvgIconProvider::class,
        'source' => 'EXT:' . $extKey . '/Resources/Public/Icons/default-icon-ce.svg',
    ],
    ...$icons,
];
