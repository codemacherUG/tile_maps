
<?php
$EM_CONF[$_EXTKEY] = [
	'title' => 'Tile Maps',
	'description' => 'TODO',
	'author' => 'Thomas Rokohl (codemacher)',
	'author_email' => 'mail@codemacher.de',
	'category' => 'plugin',
	'author_company' => 'codemacher',
	'state' => 'beta',
	'clearCacheOnLoad' => 1,
	'version' => '1.0.0',
	'constraints' => [
		'depends' => [
			'typo3' => '11.5.0-12.2.99',
			'tile_proxy' => '1.1.0-1.1.99',
			'tt_address' => '7.1.0-8.0.99',
		],
		'conflicts' => [],
		'suggests' => []
	]
];
