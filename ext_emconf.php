
<?php
$EM_CONF[$_EXTKEY] = [
    'title' => 'Tile Maps',
    'description' => 'Tile Maps allows in connection with Tile Proxy(tile_proxy) a GDPR compliant integration of OpenStreepMap maps without additional cookie dialog.',
    'author' => 'Thomas Rokohl (codemacher)',
    'author_email' => 'mail@codemacher.de',
    'category' => 'plugin',
    'author_company' => 'codemacher',
    'state' => 'stable',
    'clearCacheOnLoad' => 1,
    'version' => '1.0.6',
    'constraints' => [
        'depends' => [
            'typo3' => '12.4.0-13.4.99',
            'tile_proxy' => '1.3.3-1.3.999',
            'tt_address' => '9.0.0-9.0.99',
        ],
        'conflicts' => [],
        'suggests' => []
    ]
];
