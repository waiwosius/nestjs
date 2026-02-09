import { AddUserTable1764941864473 } from './migrations/1764941864473-AddUserTable';
import { AddUserRoleToUserTable1766063204489 } from './migrations/1766063204489-AddUserRoleToUserTable';
import { AddProductTable1766149215752 } from './migrations/1766149215752-AddProductTable';
import { AddCategoryTable1770373303946 } from './migrations/1770373303946-AddCategoryTable';
import { FixTimestamps1770390474588 } from './migrations/1770390474588-FixTimestamps';

export const DB_MIGRATIONS = [
  AddUserTable1764941864473,
  AddUserRoleToUserTable1766063204489,
  AddProductTable1766149215752,
  AddCategoryTable1770373303946,
  FixTimestamps1770390474588,
];
