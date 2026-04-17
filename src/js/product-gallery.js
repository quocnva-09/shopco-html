document.addEventListener('DOMContentLoaded', () => {
  const mainImage = document.getElementById('js-main-image');
  const thumbnails = document.querySelectorAll('.product-detail__thumbnail');

  if (!mainImage || thumbnails.length === 0) return;

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      // Update active class
      thumbnails.forEach(thumb => thumb.classList.remove('product-detail__thumbnail--active'));
      this.classList.add('product-detail__thumbnail--active');

      // Update main image source and alt
      mainImage.src = this.src;
      mainImage.alt = this.alt;
    });
  });
});
