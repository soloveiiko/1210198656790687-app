document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#productForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await response.json();

    const label = document.querySelector("#productFormLabel");
    const submit = document.querySelector("#productBlockSubmit");
    if (label) {
      label.textContent = data.label;
      submit.style.display = "none";
    }
  });
});
