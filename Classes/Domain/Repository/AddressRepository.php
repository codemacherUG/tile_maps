<?php

namespace Codemacher\TileMaps\Domain\Repository;

use FriendsOfTYPO3\TtAddress\Domain\Repository\AddressRepository as RepositoryAddressRepository;

class AddressRepository extends RepositoryAddressRepository
{
    /**
     * @return \TYPO3\CMS\Extbase\Persistence\QueryResultInterface|object[]
     * @phpstan-ignore-next-line
     */
    public function findByPids(array $pids)
    {
        $query = $this->createQuery();
        $result = $query->matching(
            $query->logicalAnd(
                $query->in('pid', $pids),
                $query->logicalNot($query->equals('latitude', 0)),
                $query->logicalNot($query->equals('longitude', 0))
            )
        )->execute();
        return $result;
    }
}
