const accountEmailInput = document.querySelector("input#accountEmail");
const searchBtn = document.querySelector("button#searchBtn");

accountEmailInput.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.keyCode === 13) {
    searchBtn.click();
  }
});

searchBtn.addEventListener("click", () => {
  if (!accountEmailInput.checkValidity()) {
    alert("Enter a valid email first.");
    return;
  }

  const account_email = accountEmailInput.value;
  const url = `/account/search/${account_email}`;

  fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((result) => {
      if (result.account_id) {
        const urlToRedirect = `/account/update/${result.account_id}`;
        location.assign(urlToRedirect);
      } else {
        alert("No account found with email.");
      }
    })
    .catch((err) => console.error(err));
});
