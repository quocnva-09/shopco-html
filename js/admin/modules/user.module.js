import { BaseCrudManager } from '../controller/BaseCrudManager.js';
import { buildUserFormLayout, buildUserFormFooter } from '../layouts/user-form.layout.js';
import { buildUserRow, buildTrashedUserRow } from '../layouts/user-table.layout.js';
import { UserService } from '../../services/user.service.js';
import { UploadService } from '../../services/upload.service.js';
import { ImageUploader } from '../components/image-uploader.js';

let imageUploaderInstance = null;

/**
 * Initializes the User Module using the Reusable CRUD Manager.
 */
export function initUserModule(container) {
  const formId = 'user-modal-form';

  imageUploaderInstance = new ImageUploader({
    containerSelector: ".js-avatar-preview-container",
    fileInputId: "field-avatar-upload",
    hiddenInputId: "field-avatar-json",
    uploadFn: UploadService.uploadUserProfileImage,
    maxImages: 1,
  });
  const userCrud = new BaseCrudManager({
    entityName: 'User',
    formId: formId,
    alwaysFetchOnEdit: true,

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
      imageUploaderInstance.init();
    },

    formatUpdateData: (data) => {
      const { name, email, phone, bio, address, avatar } = data;
      return { name, email, phone, bio, address, profile_image: avatar };
    },

    validator: validateUserForm,
    fillForm: fillUserForm
  });

  userCrud.init(container);
}

// Giữ lại các hàm util đặc thù của User ở dưới
function validateUserForm(data, mode) {
  const errors = {};

  try {
    const avatars = JSON.parse(data.avatar || "[]");
    if (avatars.length > 0) {
      data.avatar = avatars[0];
    } else {
      data.avatar = null;
    }
  } catch {
    data.avatar = null;
  }

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

  const images = user.avatar && user.avatar !== "https://shopco-s3.s3.ap-southeast-1.amazonaws.com/fallback/avatar.png"
    ? [{ url: user.avatar, path: user.avatar }]
    : [];
  imageUploaderInstance.setImages(images);
}