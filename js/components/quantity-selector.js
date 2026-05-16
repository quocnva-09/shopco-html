export function initQuantitySelectors() {
  const decreaseBtns = document.querySelectorAll('.js-qty-decrease');
  const increaseBtns = document.querySelectorAll('.js-qty-increase');
  const quantityInputs = document.querySelectorAll('.js-qty-input');

  // If there are grouped elements (like in the cart), we should ideally traverse the DOM from the button.
  // But let's attach to each button and find its sibling input.
  
  decreaseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const container = e.target.parentElement;
      const input = container.querySelector('.js-qty-input');
      if (input) {
        let currentValue = parseInt(input.value) || 1;
        if (currentValue > 1) {
          input.value = currentValue - 1;
        }
      }
    });
  });

  increaseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const container = e.target.parentElement;
      const input = container.querySelector('.js-qty-input');
      if (input) {
        let currentValue = parseInt(input.value) || 1;
        input.value = currentValue + 1;
      }
    });
  });

  quantityInputs.forEach(input => {
    input.addEventListener('change', () => {
      let currentValue = parseInt(input.value);
      if (isNaN(currentValue) || currentValue < 1) {
        input.value = 1;
      }
    });
  });
}
