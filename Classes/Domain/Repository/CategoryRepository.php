<?php

namespace Codemacher\TileMaps\Domain\Repository;

use TYPO3\CMS\Extbase\Persistence\QueryInterface;
use TYPO3\CMS\Extbase\Persistence\Repository;
use Codemacher\TileMaps\Domain\Model\Category;

/**
 * @extends Repository<Category>
 */
class CategoryRepository extends Repository
{
    protected $defaultOrderings = [
      'sorting' => QueryInterface::ORDER_ASCENDING
    ];

    /**
    * @return \TYPO3\CMS\Extbase\Persistence\QueryResultInterface|object[]
    * @phpstan-ignore-next-line
    */
    public function findByUids(array $categories)
    {
        $query = $this->createQuery();
        $query->getQuerySettings()->setRespectStoragePage(false);
        $result = $query->matching(
            $query->in('uid', $categories),
        )
          ->execute();
        return $result;
    }
}
