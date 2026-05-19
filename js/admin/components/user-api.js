/**
 * @deprecated
 * This file is kept for backward compatibility only.
 * All API calls have been consolidated into js/api/user.api.js
 * All data-mapping logic has been consolidated into js/services/user.service.js
 *
 * Do NOT add new logic here. Import from the canonical paths instead:
 *   - API layer:     import { ... } from '../../api/user.api.js'
 *   - Service layer: import { UserService } from '../../services/user.service.js'
 */

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getTrashedUsers,
  restoreUser,
  forceDeleteUser,
} from "../../api/user.api.js";
