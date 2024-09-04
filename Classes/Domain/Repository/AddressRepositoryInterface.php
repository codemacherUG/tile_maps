<?php

namespace Codemacher\TileMaps\Domain\Repository;

interface AddressRepositoryInterface
{
  /**
   * Returns all addresses to be rendered.
   */
  public function fetchAddresses() : array;
}
