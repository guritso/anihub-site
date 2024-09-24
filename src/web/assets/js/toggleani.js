document.addEventListener("DOMContentLoaded", async () => {
  const toggle = document.getElementById("theme-toggle");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  toggle.animate(
    [
      { transform: "translateX(5px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(0px)" },
    ],
    {
      duration: 200,
      iterations: 5,
    }
  );
});
