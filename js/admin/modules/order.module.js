import { BaseCrudManager } from '../controller/BaseCrudManager.js';
import {
    buildOrderFormLayout,
    buildOrderFormFooter
} from '../layouts/order-form.layout.js';
import { buildOrderRow } from '../layouts/order-table.layout.js';
import { OrderService } from '../../services/order.service.js';

/**
 * Initializes the Order Module using the Reusable CRUD Manager.
 *
 * @param {HTMLElement} container - The container element to mount the table.
 */
export function initOrderModule(container) {
    if (!container) return;

    const formId = 'order-modal-form';

    const orderCrud = new BaseCrudManager({
        entityName: 'Order',
        formId: formId,

        service: {
            fetchAll: OrderService.getAllOrders,
            fetchTrashed: async () => ({ items: [], meta: null }),
            fetchOne: OrderService.getOrderById,
            create: async () => ({ error: 'Creation not supported' }),
            update: async (id, data) => {
                return await OrderService.updateStatus(id, data.status);
            },
            trash: async () => ({ error: 'Deletion not supported' }),
            recover: async () => ({ error: 'Recovery not supported' }),
            destroy: async () => ({ error: 'Destruction not supported' })
        },

        layouts: {
            formBody: buildOrderFormLayout(formId),
            formFooter: buildOrderFormFooter(
                formId,
                'modal-save-btn',
                'modal-cancel-btn'
            ),
            row: buildOrderRow,
            trashedRow: () => ''
        },

        columns: [
            { label: 'Order', className: '' },
            { label: 'Total Amount', className: '' },
            { label: 'Items', className: '' },
            { label: 'Status', className: '' },
            { label: 'Actions', className: 'data-table__actions-col' }
        ],

        tableOptions: {
            searchPlaceholder: 'Search orders...',
            actionBtnText: ''
        },

        formatUpdateData: (data) => {
            return { status: data.status };
        },

        validator: validateOrderForm,
        fillForm: fillOrderForm
    });

    orderCrud.init(container);

    // 1. Hide the Create Order button since orders cannot be created in admin.
    const createBtn = container.querySelector('.js-create-btn');
    if (createBtn) {
        createBtn.style.display = 'none';
    }

    // 2. Hide the tabs toolbar as orders do not support soft-delete/trash.
    const tabsContainer = container.querySelector('.toolbar__tabs');
    if (tabsContainer) {
        tabsContainer.style.display = 'none';
    }
}

/**
 * Validates the order form data.
 *
 * @returns {Object} An empty object as status dropdown is always valid.
 */
function validateOrderForm() {
    return {};
}

/**
 * Fills the order form modal with existing order details and status.
 *
 * @param {Object} order - The order data.
 */
function fillOrderForm(order) {
    const idEl = document.getElementById('field-order-id');
    const totalEl = document.getElementById('field-total-amount');
    const statusEl = document.getElementById('field-status');

    if (idEl) idEl.value = order.id ? `#${order.id}` : '';
    if (totalEl) totalEl.value = order.totalAmount ? `$${order.totalAmount}` : '';
    if (statusEl) statusEl.value = order.status || 'pending';

    const itemsContainer = document.getElementById('field-order-items');
    if (itemsContainer) {
        if (!order.items || order.items.length === 0) {
            itemsContainer.innerHTML = `
                <div style="color: #9ca3af; text-align: center; padding: 8px;">
                    No items in this order.
                </div>
            `;
        } else {
            itemsContainer.innerHTML = order.items.map((item) => {
                const name = item.product?.name || 'Unknown Product';
                const price = item.price || 0;
                const qty = item.quantity || 0;
                const total = item.totalMoney || (price * qty);
                const options = item.formattedOptions
                    ? `<span style="
                        font-size: 11px;
                        color: #6b7280;
                        display: block;
                       ">${item.formattedOptions}</span>`
                    : '';

                return `
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 6px 0;
                        border-bottom: 1px dashed #e5e7eb;
                    ">
                        <div>
                            <span style="font-weight: 500; font-size: 13px;">
                                ${name}
                            </span>
                            ${options}
                        </div>
                        <div style="text-align: right; font-size: 13px;">
                            <span>${qty} x $${price}</span>
                            <span style="font-weight: 600; margin-left: 8px;">
                                $${total}
                            </span>
                        </div>
                    </div>
                `;
            }).join('');

            const lastChild = itemsContainer.lastElementChild;
            if (lastChild) {
                lastChild.style.borderBottom = 'none';
            }
        }
    }
}
