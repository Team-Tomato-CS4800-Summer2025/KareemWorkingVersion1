document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkoutForm");

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // You could extract this data if needed
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const payment = document.getElementById("payment").value;

    // Example: log it
    console.log({ name, email, address, payment });

    // Hide checkout modal and show confirmation
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById("checkoutModal"));
    const confirmationModal = new bootstrap.Modal(document.getElementById("orderConfirmationModal"));

    checkoutModal.hide();
    confirmationModal.show();

    // Optionally: clear form and cart
    checkoutForm.reset();
    document.querySelector("#cartModal .modal-body").innerHTML = "<p>Your cart is now empty.</p>";
    document.getElementById("cart-count").textContent = "0";
  });
});
