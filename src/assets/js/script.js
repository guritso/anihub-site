document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('social-container').addEventListener('wheel', function (event) {
    event.preventDefault();
    this.scrollLeft += event.deltaY;
  });

  var ac = document.getElementById('anime-container');
  var l = ac.querySelectorAll('.anime-card').length;
  var c = await fetch('api/config/anime').then(r => r.json()).then(d => d.data);

  if (l > 5) {
    ac.innerHTML += ac.innerHTML;
    ac.style.animation = `scroll ${l / c.rowSpeed}s infinite linear`;
  }
});
