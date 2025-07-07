document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkoutForm");

  if (!checkoutForm) return; // exit if no checkout form on this page

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const payment = document.getElementById("payment").value;

    console.log({ name, email, address, payment });

    const checkoutModalEl = document.getElementById("checkoutModal");
    const confirmationModalEl = document.getElementById("orderConfirmationModal");

    if (!checkoutModalEl || !confirmationModalEl) {
      console.error("Checkout or confirmation modal missing.");
      return;
    }

    const checkoutModal = bootstrap.Modal.getInstance(checkoutModalEl) || new bootstrap.Modal(checkoutModalEl);
    const confirmationModal = new bootstrap.Modal(confirmationModalEl);

    checkoutModal.hide();
    confirmationModal.show();

    checkoutForm.reset();
    document.querySelector("#cartModal .modal-body").innerHTML = "<p>Your cart is now empty.</p>";
    document.getElementById("cart-count").textContent = "0";
  });
});