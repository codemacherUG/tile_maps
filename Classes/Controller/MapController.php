<?php

namespace Codemacher\TileMaps\Controller;

use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Core\Service\FlexFormService;
use FriendsOfTYPO3\TtAddress\Domain\Repository\AddressRepository;
use TYPO3\CMS\Backend\Utility\BackendUtility;

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
    $flexFormSettings = $this->flexFormService->convertFlexFormContentToArray($contentObj->data['pi_flexform'])['settings'];

    $tileEndpointPageRecord = BackendUtility::getRecord("pages", $flexFormSettings['tileendpoint']);
    $tileEndpointPageRecordFlexFormSettings = $this->flexFormService->convertFlexFormContentToArray($tileEndpointPageRecord['tx_tileproxy_flexform'])['settings'];
    $addresses = $this->addressRepository->findAll();
    $this->view->assign("addresses",$addresses);
    $this->view->assign("bbox",$tileEndpointPageRecordFlexFormSettings['bbox']);
    $this->view->assign("data", $contentObj->data);
    $this->view->assign("settings",$flexFormSettings);
  }
}
