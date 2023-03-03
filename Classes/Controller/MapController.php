<?php

namespace Codemacher\TileMaps\Controller;

use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Core\Service\FlexFormService;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Utility\PathUtility;
use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\CMS\Core\Utility\GeneralUtility;

use FriendsOfTYPO3\TtAddress\Domain\Repository\AddressRepository;
class MapController extends ActionController
{

  // Inject FlexFormService
  public function __construct(
    private readonly FlexFormService $flexFormService,
    private readonly AddressRepository $addressRepository

  ) {
  }

  public function displayAction()
  {
    /** @var PageRenderer $pageRenderer */
    $pageRenderer =  GeneralUtility::makeInstance(PageRenderer::class);
    $pageRenderer->addInlineLanguageLabelFile('EXT:tile_maps/Resources/Private/Language/locallang.xlf');


    $contentObj = $this->configurationManager->getContentObject();
    $extSettings = $this->settings;

    $tileEndpointPageRecord = BackendUtility::getRecord("pages", $extSettings['tileEndpoint']);
    $tileEndpointPageRecordFlexFormSettings = $this->flexFormService->convertFlexFormContentToArray($tileEndpointPageRecord['tx_tileproxy_flexform'])['settings'];

    $addresses = $this->addressRepository->findAll();
    $extSettings['bbox'] = $tileEndpointPageRecordFlexFormSettings['bbox'];
    $extSettings['grayscale'] = $contentObj->data['layout']  == '1677587808';
    $extSettings['resourceUrl'] = PathUtility::getPublicResourceWebPath($this->settings['iconPath']);

    $this->view->assign("addresses",$addresses);
    $this->view->assign("data", $contentObj->data);
    $this->view->assign("settings",$extSettings);
  }
}
