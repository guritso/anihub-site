document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('social-container').addEventListener('wheel', function (event) {
    event.preventDefault();
    this.scrollLeft += event.deltaY;
  });


  const ac = document.getElementById('anime-container');
  const length = ac.querySelectorAll('.anime-card').length;
  const co = await fetch('api/config/anime').then(r => r.json()).then(d => d.data);

  if (length > 5) {
    ac.innerHTML += ac.innerHTML;
    ac.style.animation = `scroll ${length / co.rowSpeed}s infinite linear`;
  }

  const main = document.querySelector('.main-page');
  main.animate({ opacity: 1 }, 200).finished.then(() => { main.style.opacity = 1 });
});
