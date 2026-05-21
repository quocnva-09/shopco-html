import { BaseCrudManager } from '../controller/BaseCrudManager.js';
import { buildUserFormLayout, buildUserFormFooter } from '../layouts/user-form.layout.js';
import { buildUserRow, buildTrashedUserRow } from '../layouts/user-table.layout.js';
import { UserService } from '../../services/user.service.js';

/**
 * Initializes the User Module using the Reusable CRUD Manager.
 */
export function initUserModule(container) {
  const formId = 'user-modal-form';

  const userCrud = new BaseCrudManager({
    entityName: 'User',
    formId: formId,

    // Chuẩn hóa tên hàm trong Service để map với CRUD Manager
    service: {
      fetchAll: UserService.fetchUsers,
      fetchTrashed: UserService.fetchTrashedUsers,
      fetchOne: UserService.fetchUser,
      create: UserService.addUser,
      update: UserService.editUser,
      trash: UserService.trashUser,
      recover: UserService.recoverUser,
      destroy: UserService.destroyUser
    },

    layouts: {
      formBody: buildUserFormLayout(formId),
      formFooter: buildUserFormFooter(formId, 'modal-save-btn', 'modal-cancel-btn'),
      row: buildUserRow,
      trashedRow: buildTrashedUserRow
    },

    columns: [
      { label: 'User', className: '' },
      { label: 'Role', className: '' },
      { label: 'Phone', className: '' },
      { label: 'Joined', className: '' },
      { label: 'Actions', className: 'data-table__actions-col' }
    ],

    tableOptions: {
      searchPlaceholder: 'Search by name or email…',
      actionBtnText: '+ Create User'
    },

    // Xử lý UI riêng của User (ẩn/hiện field password)
    onPrepareForm: (mode) => {
      const passRow = document.querySelector('.js-password-row');
      if (passRow) passRow.style.display = mode === 'create' ? '' : 'none';
    },

    // Lọc dữ liệu update
    formatUpdateData: (data) => {
      const { name, email, phone, bio, address } = data;
      return { name, email, phone, bio, address };
    },

    validator: validateUserForm,
    fillForm: fillUserForm
  });

  userCrud.init(container);
}

// Giữ lại các hàm util đặc thù của User ở dưới
function validateUserForm(data, mode) {
  const errors = {};
  if (!data.name) errors.name = 'Full name is required.';
  if (!data.email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email.';

  if (mode === 'create') {
    if (!data.password) errors.password = 'Password is required.';
    else if (data.password.length < 8) errors.password = 'At least 8 characters.';
  }
  return errors;
}

function fillUserForm(user) {
  const fieldMap = {
    name: user.name || '', email: user.email || '',
    phone: user.phone || '', address: user.address || '',
    bio: user.bio || '', role: user.role || 'user',
  };
  Object.entries(fieldMap).forEach(([name, value]) => {
    const el = document.querySelector(`[name="${name}"]`);
    if (el) el.value = value;
  });
}