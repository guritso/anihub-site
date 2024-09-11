const API_URL = 'https://api.jikan.moe/v4';

const jikanApi = {
  getHistory: async (username) => {
    return await fetch(`${API_URL}/users/${username}/history?type=anime`).then((res) => res.json());
  },
  getAnime: async (id) => {
    return await fetch(`${API_URL}/anime/${id}`).then((res) => res.json());
  },
};

export default jikanApi;