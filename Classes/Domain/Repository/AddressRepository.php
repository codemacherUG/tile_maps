<?php

namespace Codemacher\TileMaps\Domain\Repository;

use FriendsOfTYPO3\TtAddress\Domain\Repository\AddressRepository as RepositoryAddressRepository;


class AddressRepository extends RepositoryAddressRepository
{
  public function findByPids(array $pids)
  {
    $query = $this->createQuery();
    $result = $query->matching($query->in("pid", $pids))->execute();
    return $result;
  }
}
