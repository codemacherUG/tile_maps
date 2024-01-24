<?php

namespace Codemacher\TileMaps\Controller;

use Psr\Http\Message\ResponseInterface;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Core\Service\FlexFormService;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Utility\PathUtility;
use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Persistence\QueryInterface;

use Codemacher\TileMaps\Domain\Repository\CategoryRepository;
use Codemacher\TileMaps\Domain\Repository\AddressRepository;

class MapController extends ActionController
{
    // Inject FlexFormService
    public function __construct(
        private readonly FlexFormService $flexFormService,
        private readonly AddressRepository $addressRepository
    ) {
    }

    public function displayAction(): ResponseInterface
    {
        /** @var PageRenderer $pageRenderer */
        $pageRenderer =  GeneralUtility::makeInstance(PageRenderer::class);
        $pageRenderer->addInlineLanguageLabelFile('EXT:tile_maps/Resources/Private/Language/locallang.xlf');

        $contentObj = $this->configurationManager->getContentObject();
        $extSettings = $this->settings;

        $tileEndpointPageRecord = BackendUtility::getRecord("pages", $extSettings['tileEndpoint']);
        $tileEndpointPageRecordFlexFormSettings = $this->flexFormService->convertFlexFormContentToArray($tileEndpointPageRecord['tx_tileproxy_flexform'])['settings'];

        $this->addressRepository->setDefaultOrderings(['name' => QueryInterface::ORDER_ASCENDING]);

        $pidsStr =  $contentObj->data["pages"] ?? "";
        $pids = explode(',', $pidsStr);
        $addresses = $this->addressRepository->findByPids($pids);
        $extSettings['bbox'] = $tileEndpointPageRecordFlexFormSettings['bbox'];
        $extSettings['grayscale'] = $contentObj->data['layout']  == '1677587808';
        $extSettings['resourceUrl'] = PathUtility::getPublicResourceWebPath($this->settings['iconPath']);

        $categoryIdList = null;
        if (array_key_exists('categories', $this->settings)) {
            // categories by comma separated list
            $categoryIdList = $this->settings["categories"];
        }

        if ($categoryIdList) {
            $categoryIdList = GeneralUtility::intExplode(',', (string)$categoryIdList, true);
            /** @var CategoryRepository $categoryRepository */
            $categoryRepository = GeneralUtility::makeInstance(CategoryRepository::class);
            $categories = $categoryRepository->findByUids($categoryIdList);
            $this->view->assign("filterCategories", $categories);
        }


        $this->view->assign("addresses", $addresses);
        $this->view->assign("data", $contentObj->data);
        $this->view->assign("settings", $extSettings);
        return $this->htmlResponse();
    }
}
