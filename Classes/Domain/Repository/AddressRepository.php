<?php

namespace Codemacher\TileMaps\Domain\Repository;

use TYPO3\CMS\Extbase\Persistence\Repository;

class AddressRepository extends Repository implements AddressRepositoryInterface
{
  public function fetchAddresses(): array {
    return $this->findAll()->toArray();
  }

  /**
    * @deprecated instead, use the storage page configuration in the TYPO3-backend
    * and call findAll() or fetchAddresses().
    *
    * @return \TYPO3\CMS\Extbase\Persistence\QueryResultInterface|object[]
    * @phpstan-ignore-next-line
    */
  public function findByPids(array $pids)
  {
    $query = $this->createQuery();
    $result = $query->matching(
      $query->logicalAnd([
        $query->in('pid', $pids),
        $query->logicalNot($query->equals('latitude', 0)),
        $query->logicalNot($query->equals('longitude', 0))
      ])
    )->execute();
    return $result;
  }
}
