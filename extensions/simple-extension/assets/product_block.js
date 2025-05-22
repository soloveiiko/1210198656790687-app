document.addEventListener("DOMContentLoaded", function () {
  const productBlockText = document.querySelector("#productBlockText");
  const productBlockSubmit = document.querySelector("#productBlockSubmit");

  productBlockSubmit.addEventListener("click", async () => {
    try {
      const response = await fetch(
        `https://sawfish-exact-urgently.ngrok-free.app/api/product/send`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        },
      );

      const data = await response.json();
      if (data.simple_text) {
        productBlockText.textContent = data.simple_text;
      }
    } catch (error) {
      console.error("Failed to fetch new text", error);
    }
  });
});
