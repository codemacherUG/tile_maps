<?php

namespace Codemacher\TileMaps\Controller;

use Codemacher\TileMaps\Domain\Repository\AddressRepository;
use Codemacher\TileMaps\Domain\Repository\AddressRepositoryInterface;
use Codemacher\TileMaps\Domain\Repository\CategoryRepository;
use Psr\Http\Message\ResponseInterface;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\CMS\Core\Service\FlexFormService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\PathUtility;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

class MapController extends ActionController
{
    private FlexFormService $flexFormService;

    // Inject FlexFormService
    public function __construct(FlexFormService $flexFormService)
    {
        $this->flexFormService = $flexFormService;
    }

    public function displayAction(): ResponseInterface
    {
        /** @var PageRenderer $pageRenderer */
        $pageRenderer = GeneralUtility::makeInstance(PageRenderer::class);
        $pageRenderer->addInlineLanguageLabelFile('EXT:tile_maps/Resources/Private/Language/locallang.xlf');

        /** @var \TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer $contentObj */
        $contentObj = $this->request->getAttribute('currentContentObject');
        $extSettings = $this->settings;


        $tileEndpointPageRecord = BackendUtility::getRecord('pages', $extSettings['tileEndpoint']);
        $tileEndpointPageRecordFlexFormSettings = $this->flexFormService->convertFlexFormContentToArray($tileEndpointPageRecord['tx_tileproxy_flexform'])['settings'];

        $extSettings['bbox'] = $tileEndpointPageRecordFlexFormSettings['bbox'];
        $extSettings['grayscale'] = $contentObj->data['layout'] == '1677587808';

        $extSettings['resourceUrl'] = PathUtility::getPublicResourceWebPath($this->settings['iconPath'] ?? 'EXT:tile_maps/Resources/Public/Icons/');


        $categoryIdList = null;
        if (array_key_exists('categories', $this->settings)) {
            // categories by comma separated list
            $categoryIdList = $this->settings['categories'];
        }

        if ($categoryIdList) {
            $categoryIdList = GeneralUtility::intExplode(',', (string) $categoryIdList, true);
            /** @var CategoryRepository $categoryRepository */
            $categoryRepository = GeneralUtility::makeInstance(CategoryRepository::class);
            $categories = $categoryRepository->findByUids($categoryIdList);
            $this->view->assign('filterCategories', $categories);
        }

        $addresses = $this->getAddressRepository()->fetchAddresses();

        $this->view->assign('addresses', $addresses);
        $this->view->assign('data', $contentObj->data);
        $this->view->assign('settings', $extSettings);

        return $this->htmlResponse();
    }

    protected function getAddressRepository(): AddressRepositoryInterface
    {
        return GeneralUtility::makeInstance(AddressRepository::class);
    }
}
