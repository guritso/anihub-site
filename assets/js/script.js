
document.addEventListener('DOMContentLoaded', async () => {
    const profileLayout = document.getElementById('profile-info');
    const userInfo = await getUserInfo();

    profileLayout.innerHTML = `
    <h1>${userInfo.name}</h1>
    <h2>${userInfo.description}</h2>
    `;


    const animeLayout = document.getElementById('anime-container');
    const animeList = await fetch(`https://api.jikan.moe/v4/users/${userInfo.myanimelist_username}/history`);
    
    const animeListData = await animeList.json();
    const animes = []
    
    for (const anime of animeListData.data) {
        const animeRequest = await fetch(`https://api.jikan.moe/v4/anime/${anime.entry.mal_id}`).catch(error => {
            return {
                data: {
                    title: "Error",
                    images: {
                        webp: {
                            image_url: ""
                        }
                    }
                }
            }
        });
        const animeObject = await animeRequest.json();
        
        // await new Promise(resolve => setTimeout(resolve, 200));
        
        if (animes.includes(anime.entry.mal_id)) {
            continue;
        }

        animes.push(anime.entry.mal_id);

        const animeData = {
            id: anime.entry.mal_id,
            title: animeObject.data.title,
            image: animeObject.data.images.webp.image_url,
            episodes: animeObject.data.episodes,
            increment: anime.increment,
            date: anime.date,
            link: anime.entry.url
        };

        if (animeData.episodes == animeData.increment) {
            animeLayout.innerHTML += `
            <a class="anime-card" href="${animeData.link}" target="_blank" style="background-image: url(${animeData.image})">
            <p id="anime-title">${animeData.title}</p>
            <p id="anime-date">${animeData.date}</p>
            </a>
            `;
        }
        
    }
    // add a copy of all animeLayout elements so the scrool animation -50% works
    animeLayout.innerHTML += animeLayout.innerHTML;
});

async function getUserInfo() {
    const userInfo = await fetch('http://localhost:3000/api/user').then(res => res.json());
    return userInfo;
}