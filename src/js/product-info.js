document.addEventListener('DOMContentLoaded', () => {
  const quantityInput = document.querySelector('.js-qty-input');
  const decreaseBtn = document.querySelector('.js-qty-decrease');
  const increaseBtn = document.querySelector('.js-qty-increase');
  const addCartForm = document.getElementById('js-add-to-cart-form');

  if (quantityInput && decreaseBtn && increaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value) || 1;
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    increaseBtn.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value) || 1;
      quantityInput.value = currentValue + 1;
    });

    // Prevent negative or non-numeric input
    quantityInput.addEventListener('change', () => {
      let currentValue = parseInt(quantityInput.value);
      if (isNaN(currentValue) || currentValue < 1) {
        quantityInput.value = 1;
      }
    });
  }

  if (addCartForm) {
    addCartForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(addCartForm);
      const selectedColor = formData.get('color');
      const selectedSize = formData.get('size');
      const quantity = quantityInput ? quantityInput.value : 1;

      console.log('Added to Cart:', {
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
      });

      alert(`Added ${quantity} item(s) to cart!\nColor: ${selectedColor}\nSize: ${selectedSize}`);
    });
  }
});
