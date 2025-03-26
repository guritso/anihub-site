document.addEventListener("DOMContentLoaded", () => {
  const expandButton = document.getElementById("expand-animes");
  const animeLayout = document.getElementById("animes-layout");
  const animeContainer = document.getElementById("anime-container");
  
  let isExpanded = false;
  
  expandButton.addEventListener("click", () => {
    isExpanded = !isExpanded;
    
    if (isExpanded) {
      animeLayout.classList.add("expanded");
      animeContainer.classList.add("grid-view");
      animeContainer.style.animation = "none";
      expandButton.classList.add("expanded");
    } else {
      animeLayout.classList.remove("expanded");
      animeContainer.classList.remove("grid-view");
      
      const length = animeContainer.querySelectorAll(".anime-card").length / 2;
      if (length > 5) {
        fetch("api/config/anime")
          .then((r) => r.json())
          .then((d) => {
            const speed = d.data.rowSpeed || 0.6;
            animeContainer.style.animation = `scroll ${length / speed}s infinite linear`;
          })
          .catch(() => {
            animeContainer.style.animation = `scroll ${length / 0.6}s infinite linear`;
          });
      }
      expandButton.classList.remove("expanded");
    }
  });
}); 