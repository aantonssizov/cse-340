const form = document.querySelector(".edit-inventory-form");
form.addEventListener("change", () => {
  const updateBtn = document.querySelector("button");
  updateBtn.removeAttribute("disabled");
});
