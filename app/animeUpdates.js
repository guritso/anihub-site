const fs = require('fs')
const path = require('path')

const animesCache = new Map()
const episodesCache = new Map()

const TIMEOUT = 30000 // 30 seconds
const API_URL = 'https://api.jikan.moe/v4';
const IMAGES_PATH = path.join(process.cwd(), 'assets', 'img', 'animes');

async function getAnimeHistory(username) {
  return await fetch(`${API_URL}/users/${username}/history`);
}

async function getAnimeInfo(id) {
  return await fetch(`${API_URL}/anime/${id}`);
}

async function saveAnimeImage(url, id) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  if (fs.existsSync(`${IMAGES_PATH}/${id}.webp`)) return;

  fs.writeFileSync(`${IMAGES_PATH}/${id}.webp`, Buffer.from(buffer));
}

async function createAnimeObject(anime) {
  const animeRequest = await getAnimeInfo(anime.entry.mal_id);
  const animeObject = await animeRequest.json()

  if (!animeRequest.ok || !animeObject?.data) return null;

  const date = new Date(anime.date)
  const imageUrl = animeObject.data.images.webp.image_url

  await saveAnimeImage(imageUrl, anime.entry.mal_id)

  return {
    id: anime.entry.mal_id,
    title: animeObject.data.title,
    image: `http://localhost:3000/assets/img/animes/${anime.entry.mal_id}.webp`,
    episodes: animeObject.data.episodes,
    airing: animeObject.data.airing,
    link: anime.entry.url,
    user: {
      completed: animeObject.data.episodes == anime.increment,
      increment: anime.increment,
      date: date,
      dateFormatted: date.toLocaleDateString()
    }
  }
}

async function updateList(username) {
  console.log('Sync on progress...');

  try {
    const historyList = await getAnimeHistory(username)
    const historyListData = await historyList.json();

    for (const anime of historyListData.data) {
      const animeObject = await createAnimeObject(anime)

      if (!animeObject) {
        process.stdout.write('!');
        continue;
      }

      episodesCache.set(`${animeObject.id}-E${animeObject.user.increment}`, animeObject)

      process.stdout.write('|');

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const episodes = Array.from(episodesCache.values())

    episodes.sort((a, b) => b.user.date - a.user.date)
    animesCache.set(username, episodes)

    console.log(`\n${episodesCache.size}/${historyListData.data.length} episodes synced |cache: ${animesCache.get(username).length}`);
  } catch (error) {
    console.log(`\nerror: ${error?.message || "unknown error"}`);
  }
}

async function getAnimesCache(username) {
  return animesCache.get(username)
}

async function startSyncing(username, interval = TIMEOUT) {
  while (true) {
    await updateList(username)
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

module.exports = { startSyncing, getAnimesCache }
