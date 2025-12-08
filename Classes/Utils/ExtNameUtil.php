<?php

namespace Codemacher\TileMaps\Utils;

class ExtNameUtil
{
  public static function extKeyAsShortName(string $extensionKey): string
  {
    $extensionName = preg_replace('/[\s,_]+/', '', $extensionKey);

    return strtolower($extensionName);
  }
}
