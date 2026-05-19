/**
 * Simple Toast utility for showing notifications
 */
class Toast {
  constructor() {
    this.container = document.getElementById("toast-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(this.container);
    }
  }

  show(message, type = "success", duration = 3000) {
    const toast = document.createElement("div");
    
    // Base styles
    toast.style.cssText = `
      min-width: 250px;
      padding: 16px 20px;
      border-radius: 8px;
      color: white;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;

    // Type specific styles
    if (type === "success") {
      toast.style.backgroundColor = "#28a745";
    } else if (type === "error") {
      toast.style.backgroundColor = "#dc3545";
    } else {
      toast.style.backgroundColor = "#333";
    }

    toast.innerHTML = `
      <span>${message}</span>
      <button style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; padding: 0; margin-left: 10px;">&times;</button>
    `;

    // Handle close button
    const closeBtn = toast.querySelector("button");
    closeBtn.addEventListener("click", () => this.remove(toast));

    this.container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast);
      }, duration);
    }
  }

  remove(toast) {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => {
      if (toast.parentNode === this.container) {
        this.container.removeChild(toast);
      }
    }, 300);
  }
}

export const toast = new Toast();
