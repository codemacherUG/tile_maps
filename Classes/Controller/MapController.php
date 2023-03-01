<?php

namespace Codemacher\TileMaps\Controller;

use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Core\Service\FlexFormService;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Utility\PathUtility;

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
    $contentObj = $this->configurationManager->getContentObject();
    $settings = $this->flexFormService->convertFlexFormContentToArray($contentObj->data['pi_flexform'])['settings'];

    $tileEndpointPageRecord = BackendUtility::getRecord("pages", $settings['tileEndpoint']);
    $tileEndpointPageRecordFlexFormSettings = $this->flexFormService->convertFlexFormContentToArray($tileEndpointPageRecord['tx_tileproxy_flexform'])['settings'];

    $addresses = $this->addressRepository->findAll();
    $settings['bbox'] = $tileEndpointPageRecordFlexFormSettings['bbox'];
    $settings['grayscale'] = $contentObj->data['layout']  == '1677587808';
    $settings['resourceUrl'] = PathUtility::getPublicResourceWebPath('EXT:tile_maps/Resources/Public/Icons/');
    $this->view->assign("addresses",$addresses);
    $this->view->assign("data", $contentObj->data);
    $this->view->assign("settings",$settings);
  }
}
