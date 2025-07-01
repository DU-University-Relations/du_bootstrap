document.addEventListener('DOMContentLoaded', function () {
    const toastElements = document.querySelectorAll('.toast');
    toastElements.forEach((toastEl) => {
      const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 5000 });
      toast.show();
    });
  });
  