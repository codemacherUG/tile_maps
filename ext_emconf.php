
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
	'version' => '1.0.3',
	'constraints' => [
		'depends' => [
			'typo3' => '11.5.0-12.4.99',
			'tile_proxy' => '1.2.1-1.2.999',
			'tt_address' => '7.1.0-8.0.99',
		],
		'conflicts' => [],
		'suggests' => []
	]
];
