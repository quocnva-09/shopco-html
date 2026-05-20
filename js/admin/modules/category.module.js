import { BaseCrudManager } from '../controller/BaseCrudManager.js';
import { buildCategoryFormLayout, buildCategoryFormFooter } from '../layouts/category-form.layout.js';
import { buildCategoryRow, buildTrashedCategoryRow } from '../layouts/category-table.layout.js';
import { CategoryService } from '../../services/category.service.js';

/**
 * Initializes the Category Module using the Reusable CRUD Manager.
 *
 * @param {HTMLElement} container - The container element to mount the table.
 */
export function initCategoryModule(container) {
    const formId = 'category-modal-form';

    const categoryCrud = new BaseCrudManager({
        entityName: 'Category',
        formId: formId,

        service: {
            fetchAll: CategoryService.getAdminCategories,
            fetchTrashed: CategoryService.getTrashedCategories,
            fetchOne: CategoryService.getAdminCategory,
            create: CategoryService.createCategory,
            update: CategoryService.updateCategory,
            trash: CategoryService.deleteCategory,
            recover: CategoryService.restoreCategory,
            destroy: CategoryService.forceDeleteCategory
        },

        layouts: {
            formBody: buildCategoryFormLayout(formId),
            formFooter: buildCategoryFormFooter(
                formId,
                'modal-save-btn',
                'modal-cancel-btn'
            ),
            row: buildCategoryRow,
            trashedRow: buildTrashedCategoryRow
        },

        columns: [
            { label: 'Category', className: '' },
            { label: 'Created At', className: '' },
            { label: 'Updated At', className: '' },
            { label: 'Actions', className: 'data-table__actions-col' }
        ],

        tableOptions: {
            searchPlaceholder: 'Search categories...',
            actionBtnText: '+ Create Category'
        },

        formatUpdateData: (data) => {
            const { name, slug, description } = data;
            return { name, slug, description };
        },

        validator: validateCategoryForm,
        fillForm: fillCategoryForm
    });

    categoryCrud.init(container);
}

/**
 * Validates the category form data.
 *
 * @param {Object} data - The form data to validate.
 * @returns {Object} An object containing validation error messages.
 */
function validateCategoryForm(data) {
    const errors = {};

    if (!data.name) {
        errors.name = 'Category name is required.';
    }

    if (!data.slug) {
        errors.slug = 'Slug is required.';
    } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
        errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens.';
    }

    return errors;
}

/**
 * Fills the category form with existing category data for editing.
 *
 * @param {Object} category - The category data.
 */
function fillCategoryForm(category) {
    const fieldMap = {
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || ''
    };

    Object.entries(fieldMap).forEach(([name, value]) => {
        const el = document.querySelector(`[name="${name}"]`);
        if (el) el.value = value;
    });
}
