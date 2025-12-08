<?php

namespace Codemacher\TileMaps\Domain\Repository;

use Codemacher\TileMaps\Domain\Model\Address;
use TYPO3\CMS\Extbase\Persistence\QueryInterface;
use TYPO3\CMS\Extbase\Persistence\QueryResultInterface;
use TYPO3\CMS\Extbase\Persistence\Repository;

/**
 * @extends Repository<Address>
 */
class AddressRepository extends Repository implements AddressRepositoryInterface
{
    protected $defaultOrderings = [
      'sorting' => QueryInterface::ORDER_ASCENDING
    ];

    /**
     * Summary of fetchAddresses
     * @return array<Address>
     */
    public function fetchAddresses(): array
    {
        /**
         * @var QueryResultInterface<string, Address>
         */
        $result = $this->findAll();
        /** @var array<Address> */
        $array = $result->toArray();
        return $array;
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
            $query->logicalAnd(
                $query->in('pid', $pids),
                $query->logicalNot($query->equals('latitude', 0)),
                $query->logicalNot($query->equals('longitude', 0))
            )
        )->execute();
        return $result;
    }
}
