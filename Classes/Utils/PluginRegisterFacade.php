<?php

namespace Codemacher\TileMaps\Utils;

use Codemacher\TileMaps\Domain\Model\Plugin;
use TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider;
use TYPO3\CMS\Core\Imaging\IconRegistry;
use TYPO3\CMS\Core\Utility\ArrayUtility;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Utility\ExtensionUtility;

class PluginRegisterFacade
{
    /**
     * @var array<Plugin>
     */
    protected static $pluginsToConfigure = [];

    /**
     * @var array<Plugin>
     */
    protected static $pluginsToRegister = [];

    public static function configureAllPlugins(string $extKey, string $relPathToConfigFiles): void
    {
        $iconRegistry = GeneralUtility::makeInstance(IconRegistry::class);
        $iconRegistry->registerIcon(
            'smart-plugin-default-icon-ce',
            SvgIconProvider::class,
            ['source' => 'EXT:smart_plugin/Resources/Public/Icons/default-icon-ce.svg']
        );

        self::loadPluginConfigurations($extKey, $relPathToConfigFiles);
        /** @var Plugin $plugin */
        foreach (self::$pluginsToConfigure as $plugin) {
            ExtensionUtility::configurePlugin(
                $plugin->getExtensionKey(),
                $plugin->getPluginName(),
                $plugin->getControllerActions(),
                $plugin->getNonCacheableControllerActions(),
                $plugin->getPluginType()
            );



            self::registerIconsForPlugin($plugin);

        }

        self::$pluginsToConfigure = [];
    }

    public static function getExtensionShortName(string $extensionKey): string
    {
        $extensionName = preg_replace('/[\s,_]+/', '', $extensionKey);

        return strtolower($extensionName);
    }

    private static function loadPluginConfigurations(string $extKey, string $relPathToConfigFiles): void
    {
        $extPath = ExtensionManagementUtility::extPath($extKey);
        //$absPath = PathUtility::getAbsoluteWebPath($extPath . $relPathToConfigFiles);
        $absPath = $extPath . $relPathToConfigFiles;

        $files = glob($absPath . '/*.php');
        if ($files === false) {
            $files = [];
        }
        foreach ($files as $filename) {
            include $filename;
        }
    }

    private static function getIconIdentifier(Plugin $plugin): string
    {
        if (empty($plugin->getIconFileName())) {
            return 'smart-plugin-default-icon-ce';
        }

        $underscoreName = GeneralUtility::camelCaseToLowerCaseUnderscored($plugin->getExtensionKey());

        return "ext-$underscoreName-content-" . self::getPluginId($plugin) . '-icon';
    }

    private static function registerIconsForPlugin(Plugin $plugin): void
    {
        if (empty(self::getIconFilePath($plugin))) {
            return;
        }
        $iconRegistry = GeneralUtility::makeInstance(IconRegistry::class);
        $iconRegistry->registerIcon(
            self::getIconIdentifier($plugin),
            SvgIconProvider::class,
            ['source' => self::getIconFilePath($plugin)]
        );
    }

    private static function getSpeakingNameDefinition(Plugin $plugin): string
    {
        $underscoreName = GeneralUtility::camelCaseToLowerCaseUnderscored($plugin->getExtensionKey());

        return "LLL:EXT:$underscoreName/Resources/Private/Language/locallang_be.xlf:content_element." . self::getPluginId($plugin);
    }

    private static function getSpeakingDescriptionDefinition(Plugin $plugin): string
    {
        $underscoreName = GeneralUtility::camelCaseToLowerCaseUnderscored($plugin->getExtensionKey());

        return "LLL:EXT:$underscoreName/Resources/Private/Language/locallang_be.xlf:content_element." . self::getPluginId($plugin) . '.description';
    }


    private static function buildFlexFormPathKey(Plugin $plugin): string
    {
        $underscoreName = GeneralUtility::camelCaseToLowerCaseUnderscored($plugin->getExtensionKey());

        return 'FILE:EXT:' . $underscoreName . '/Configuration/FlexForms/' . $plugin->getPluginName() . '.xml';
    }

    private static function registerPlugin(Plugin $plugin): void
    {

        // $underscoreName = GeneralUtility::camelCaseToLowerCaseUnderscored($plugin->getExtensionKey());
        ExtensionUtility::registerPlugin(
            $plugin->getExtensionKey(),
            $plugin->getPluginName(),
            self::getSpeakingNameDefinition($plugin),
            self::getIconFilePath($plugin),
            $plugin->getWizardGroupId(),
            self::getSpeakingDescriptionDefinition($plugin)
        );

        if ($plugin->isFlexFromEnabled()) {
            $pluginSignature = ExtNameUtil::extKeyAsShortName($plugin->getExtensionKey()) . '_' . self::getPluginId($plugin);
            $GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist'][$pluginSignature] = 'pi_flexform';
            ExtensionManagementUtility::addPiFlexFormValue(
                $pluginSignature,
                self::buildFlexFormPathKey($plugin)
            );
        }
    }

    private static function registerContentType(Plugin $plugin): void
    {
        $contentType = ExtNameUtil::extKeyAsShortName($plugin->getExtensionKey()) . '_' . self::getPluginId($plugin);
        $customConfig = $plugin->getCustomConfig();
        $config = array_merge(
            [
            'showitem' => implode(',', $plugin->getShowItemsConfiguration()),
      ],
            $customConfig
        );

        ArrayUtility::mergeRecursiveWithOverrule($GLOBALS['TCA']['tt_content'], [
          'ctrl' => [
            'typeicon_classes' => [
              $contentType => self::getIconIdentifier($plugin),
            ],
          ],
          'types' => [
            $contentType => $config,
          ],
        ]);

        if ($plugin->isFlexFromEnabled()) {
            $flexFormDefinition = [
              'columns' => [
                'pi_flexform' => [
                  'config' => [
                    'ds' => [
                      '*,' . $contentType => self::buildFlexFormPathKey($plugin),
                    ],
                  ],
                ],
              ],
            ];
            ArrayUtility::mergeRecursiveWithOverrule($GLOBALS['TCA']['tt_content'], $flexFormDefinition);
        }

        ExtensionManagementUtility::addTcaSelectItem(
            'tt_content',
            'CType',
            [
            self::getSpeakingNameDefinition($plugin),
            $contentType,
            self::getIconIdentifier($plugin),
            $plugin->getWizardGroupId(),
            self::getSpeakingDescriptionDefinition($plugin)
      ]
        );
    }

    public static function registerAllPlugins(): void
    {
        /** @var Plugin $plugin */
        foreach (self::$pluginsToRegister as $plugin) {
            if ($plugin->getPluginType() == ExtensionUtility::PLUGIN_TYPE_CONTENT_ELEMENT) {
                self::registerContentType($plugin);
            } else {
                self::registerPlugin($plugin);
            }
        }
        self::$pluginsToRegister = [];
    }

    public static function definePlugin(Plugin $plugin): Plugin
    {
        self::$pluginsToConfigure[] = $plugin;
        self::$pluginsToRegister[] = $plugin;

        return $plugin;
    }

    private static function getPluginId(Plugin $plugin): string
    {
        return strtolower($plugin->getPluginName());
    }

    private static function getIconFilePath(Plugin $plugin): string
    {
        $fileName = $plugin->getIconFileName();
        if (empty($fileName)) {
            return '';
        }
        $underscoreName = GeneralUtility::camelCaseToLowerCaseUnderscored($plugin->getExtensionKey());
        $result = 'EXT:' . $underscoreName . '/Resources/Public/Icons/' . $fileName;

        return $result;
    }


}
