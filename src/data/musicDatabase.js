// Music database with Hindi and English songs organized by mood
export const musicDatabase = {
  english: {
    happy: [
      { id: 1, title: "Happy", artist: "Pharrell Williams", genre: "Pop", spotify: "spotify:track:60nZcImufyMA1MKQY3dcCH", youtube: "ZbZSe6N_BXs" },
      { id: 2, title: "Good as Hell", artist: "Lizzo", genre: "Pop", spotify: "spotify:track:1PVzeHeNMg2HSS8nOcbBaL", youtube: "SmbmeOgWsqE" },
      { id: 3, title: "Can't Stop the Feeling!", artist: "Justin Timberlake", genre: "Pop", spotify: "spotify:track:4bHsxqR3GMrXTxEPLuK5ue", youtube: "ru0K8uYEZWw" },
      { id: 4, title: "Walking on Sunshine", artist: "Katrina and the Waves", genre: "Pop", spotify: "spotify:track:05wIrZSwuaVWhcv5FfqeH0", youtube: "iPUmE-tne5U" },
      { id: 5, title: "Don't Worry Be Happy", artist: "Bobby McFerrin", genre: "Reggae", spotify: "spotify:track:6ejkqvGiTlHd8uQyNcYAWX", youtube: "d-diB65scQU" },
    ],
    calm: [
      { id: 6, title: "Weightless", artist: "Marconi Union", genre: "Ambient", spotify: "spotify:track:6p0q6zNVgbOi6YfhXKGdZf", youtube: "UfcAVejslrU" },
      { id: 7, title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical", spotify: "spotify:track:4Nd5HJn4EExnLmHtClk4QV", youtube: "CvFH_6DNRCY" },
      { id: 8, title: "Mad World", artist: "Gary Jules", genre: "Alternative", spotify: "spotify:track:4Mw9Gcu1LT7JaWXzr0Q62z", youtube: "4N3N1MlvVc4" },
      { id: 9, title: "The Night We Met", artist: "Lord Huron", genre: "Indie Folk", spotify: "spotify:track:0RiRZpuVRbi7oqRdSMwhQY", youtube: "KtlgYxa6BMU" },
      { id: 10, title: "Holocene", artist: "Bon Iver", genre: "Indie Folk", spotify: "spotify:track:2JMcU3A8HgrjqoVkm1BqlP", youtube: "TWcyIpul8OE" },
    ],
    excited: [
      { id: 11, title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Funk", spotify: "spotify:track:32OlwWuMpZ6b0aN2RZOeMS", youtube: "OPf0YbXqDm0" },
      { id: 12, title: "I Gotta Feeling", artist: "The Black Eyed Peas", genre: "Pop", spotify: "spotify:track:4uLU6hMCjMI75M1A2tKUQC", youtube: "uSD4vsh1zDA" },
      { id: 13, title: "Pump It", artist: "The Black Eyed Peas", genre: "Hip Hop", spotify: "spotify:track:3URxKF1bxVUH3pUfm9r9vE", youtube: "ZaI2IlHwmgQ" },
      { id: 14, title: "Thunder", artist: "Imagine Dragons", genre: "Pop Rock", spotify: "spotify:track:1zB4vmk8tFRmM9UULNzbLB", youtube: "fKopy74weus" },
      { id: 15, title: "Levitating", artist: "Dua Lipa", genre: "Pop", spotify: "spotify:track:463CkQjx2Zk1yXoBuierM9", youtube: "TUVcZfQe-Kw" },
    ],
    sad: [
      { id: 16, title: "Hurt", artist: "Johnny Cash", genre: "Country", spotify: "spotify:track:2m3ObA3wvkBRjUsf8Zmbxz", youtube: "8AHCfZTRGiI" },
      { id: 17, title: "Mad World", artist: "Gary Jules", genre: "Alternative", spotify: "spotify:track:4Mw9Gcu1LT7JaWXzr0Q62z", youtube: "4N3N1MlvVc4" },
      { id: 18, title: "Black", artist: "Pearl Jam", genre: "Grunge", spotify: "spotify:track:4RA3F2WGsZKuxny4qTLXNz", youtube: "5ChbxMVgGV4" },
      { id: 19, title: "Tears in Heaven", artist: "Eric Clapton", genre: "Rock", spotify: "spotify:track:4bHsxqR3GMrXTxEPLuK5ue", youtube: "JxPj3GAYYZ0" },
      { id: 20, title: "Everybody Hurts", artist: "R.E.M.", genre: "Alternative Rock", spotify: "spotify:track:0qYTZCo5Bwh1nsUFGZP3zn", youtube: "5rOiW_xY-kc" },
    ],
    energetic: [
      { id: 21, title: "Eye of the Tiger", artist: "Survivor", genre: "Rock", spotify: "spotify:track:2HHtWyy5CgaQbC7XSoOb0e", youtube: "btPJPFnesV4" },
      { id: 22, title: "Stronger", artist: "Kanye West", genre: "Hip Hop", spotify: "spotify:track:0NhOmTiGHTzpoaXjZqagSJ", youtube: "PsO6ZnUZI0g" },
      { id: 23, title: "Till I Collapse", artist: "Eminem", genre: "Hip Hop", spotify: "spotify:track:4xkOaSrkexMciUUogZKVNi", youtube: "_Yhyp-_hX2s" },
      { id: 24, title: "Don't Stop Me Now", artist: "Queen", genre: "Rock", spotify: "spotify:track:5T8EDUDqKcs6OSOwQlwMlf", youtube: "HgzGwKwLmgM" },
      { id: 25, title: "Pump It Up", artist: "Elvis Costello", genre: "New Wave", spotify: "spotify:track:7rSfbKa4P2bFUZ4yNoG8xT", youtube: "EmMRSqXQn3w" },
    ],
    peaceful: [
      { id: 26, title: "Aqueous Transmission", artist: "Incubus", genre: "Alternative Rock", spotify: "spotify:track:1gJnBbWnkTnVw8niqk7dWI", youtube: "3k0-sGqxIiQ" },
      { id: 27, title: "Samsara", artist: "Audiomachine", genre: "Cinematic", spotify: "spotify:track:2vbHYcUDrA8B9Bfb8kLsqX", youtube: "QiSokgUgQfw" },
      { id: 28, title: "On Nature", artist: "Max Richter", genre: "Neoclassical", spotify: "spotify:track: ", youtube: "k-X1AKcPF3Y" },
      { id: 29, title: "River", artist: "Leon Bridges", genre: "Soul", spotify: "spotify:track:4gphxUgq0SCSOClUBJOHaS", youtube: "0Hegd4xNfRo" },
      { id: 30, title: "The Swan", artist: "Camille Saint-Saëns", genre: "Classical", spotify: "spotify:track:2Foc5Q5nqNiosCNqttzHof", youtube: "u8s7h7sboQw" },
    ],
    neutral: [
      { id: 31, title: "Fluorescent Adolescent", artist: "Arctic Monkeys", genre: "Indie Rock", spotify: "spotify:track:4qS6lbKRKMjhww4a96MdYj", youtube: "ma9I9VBKPiw" },
      { id: 32, title: "Mr. Brightside", artist: "The Killers", genre: "Alternative Rock", spotify: "spotify:track:003vvx7Niy0ywjVN9WqfLx", youtube: "gGdGFtwCNBE" },
      { id: 33, title: "Take Me Out", artist: "Franz Ferdinand", genre: "Indie Rock", spotify: "spotify:track:0J9paBmImIBXGiKyOstd4P", youtube: "Ijk4j-r7qPA" },
      { id: 34, title: "Seven Nation Army", artist: "The White Stripes", genre: "Alternative Rock", spotify: "spotify:track:3dPQuX8Gs42Y7b454ybpMR", youtube: "0J2QdDbelmY" },
      { id: 35, title: "Use Somebody", artist: "Kings of Leon", genre: "Alternative Rock", spotify: "spotify:track:6b8Be6ljOzmkOmFslEb23P", youtube: "gnhXHvRoUd0" },
    ],
  },
  hindi: {
    happy: [
      { id: 101, title: "Jai Ho", artist: "A.R. Rahman", genre: "Bollywood", spotify: "spotify:track:1mKdKTOr0xNlmeNGArBY0H", youtube: "YR12Z8f1Dh8" },
      { id: 102, title: "Nagada Sang Dhol", artist: "Osman Mir, Shreya Ghoshal", genre: "Bollywood", spotify: "spotify:track:2w3dZV5T5NCR4Ow7HZNsz3", youtube: "5Ck8lkfuAq8" },
      { id: 103, title: "Gallan Goodiyaan", artist: "Yashita Sharma, Maninder Buttar", genre: "Bollywood", spotify: "spotify:track:7FPXKoJKcTi6O9Mc9iLsKo", youtube: "neZ1JyREIHI" },
      { id: 104, title: "Ishq Wala Love", artist: "Salim-Sulaiman", genre: "Bollywood", spotify: "spotify:track:5vxfp0qzUEY7ooJa8HZa2m", youtube: "9LNKp2pwS6E" },
      { id: 105, title: "London Thumakda", artist: "Labh Janjua, Suchitra", genre: "Bollywood", spotify: "spotify:track:3Pd6JpSNgUTFzz4U8mT0E8", youtube: "UhoCY9LqKsQ" },
    ],
    calm: [
      { id: 106, title: "Tum Hi Ho", artist: "Arijit Singh", genre: "Bollywood Romantic", spotify: "spotify:track:7JgAyb7hVEw9GGVPTIBgBM", youtube: "IJq0yyWug1k" },
      { id: 107, title: "Raag Bhairavi", artist: "Pandit Ravi Shankar", genre: "Classical", spotify: "spotify:track:3Yt6Uf7wWKiP2JLNgaVDef", youtube: "lk60ObnbIOk" },
      { id: 108, title: "Ve Maahi", artist: "Arijit Singh, Asees Kaur", genre: "Bollywood", spotify: "spotify:track:4YkWv4Pk7yrOGMBnVGiwaZ", youtube: "aJhHCVOCK_s" },
      { id: 109, title: "Khairiyat", artist: "Arijit Singh", genre: "Bollywood", spotify: "spotify:track:7eaRAYGwEPqfqMTnWVRB5e", youtube: "W9j47R-_0Yg" },
      { id: 110, title: "Main Rang Sharbaton Ka", artist: "Atif Aslam", genre: "Bollywood", spotify: "spotify:track:2PMhcLAEf0EYfR5X0VL9Sk", youtube: "PZ8MdHBShP4" },
    ],
    excited: [
      { id: 111, title: "Malhari", artist: "Vishal Dadlani", genre: "Bollywood", spotify: "spotify:track:1iYzXmchTOYCCGUBOcMBPO", youtube: "l_MyUGq7pgs" },
      { id: 112, title: "Ala Vaikunthapurramuloo", artist: "Armaan Malik", genre: "Telugu", spotify: "spotify:track:5XkFtdNNePsWQPvwwZFGQ7", youtube: "YjMBxZiaSJ8" },
      { id: 113, title: "Apna Time Aayega", artist: "Ranveer Singh, Divine", genre: "Bollywood Rap", spotify: "spotify:track:2sB0VTdlGKK6XgE7T5PFUJ", youtube: "SlPhMPnQ58k" },
      { id: 114, title: "Khalibali", artist: "Shivam Pathak, Shail Hada", genre: "Bollywood", spotify: "spotify:track:4cLUrzDWU4VbOjPIWNHwVF", youtube: "fRjjQJUuqTY" },
      { id: 115, title: "Tattad Tattad", artist: "Udit Narayan", genre: "Bollywood", spotify: "spotify:track:6yXzNGZpj6yE3Z6aW4LW9z", youtube: "AEIVlYegmQE" },
    ],
    sad: [
      { id: 116, title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", genre: "Bollywood", spotify: "spotify:track:1J6KqZrGE3IM4VCTMDq8hT", youtube: "Z_PODraXg4E" },
      { id: 117, title: "Hamari Adhuri Kahani", artist: "Arijit Singh", genre: "Bollywood", spotify: "spotify:track:3qJMN6ub2g7cYgbJLm7OzK", youtube: "WctWEqGKhcw" },
      { id: 118, title: "Muskurane", artist: "Arijit Singh", genre: "Bollywood", spotify: "spotify:track:5DHSGCvH4CHgGX9gTj7pqe", youtube: "kWa3vshJSgA" },
      { id: 119, title: "Kabira", artist: "Tochi Raina, Rekha Bhardwaj", genre: "Bollywood", spotify: "spotify:track:4JkX6G7UmMq1u2VWW6h8r8", youtube: "jHNNMj5bNQw" },
      { id: 120, title: "Raabta", artist: "Arijit Singh", genre: "Bollywood", spotify: "spotify:track:2DM3lk0nXv3qJB8LUL9YfD", youtube: "V0xKKONbXeQ" },
    ],
    energetic: [
      { id: 121, title: "Dangal", artist: "Daler Mehndi", genre: "Bollywood", spotify: "spotify:track:7BVEo7B6XKWuDjMJO5QdGo", youtube: "6kZlKPLWr7Q" },
      { id: 122, title: "Sultan", artist: "Rahat Fateh Ali Khan", genre: "Bollywood", spotify: "spotify:track:2QLK8OQ8aHj9fLr2b9WgXE", youtube: "4pVQ4ahKBKA" },
      { id: 123, title: "Seeti Maar", artist: "Devi Sri Prasad", genre: "Telugu", spotify: "spotify:track:3pPaKp6qhZG1aNQ3nGz4FW", youtube: "HK0PpdCGXPY" },
      { id: 124, title: "Kesariya", artist: "Arijit Singh", genre: "Bollywood", spotify: "spotify:track:2DL4P8CnhhhGJn7BtcdLIc", youtube: "BddP6PYo2gs" },
      { id: 125, title: "Balam Pichkari", artist: "Shalmali Kholgade, Vishal Dadlani", genre: "Bollywood", spotify: "spotify:track:7vqRk8QKNt7qNbE9FQkCmG", youtube: "0Bt8Hpc5zZY" },
    ],
    peaceful: [
      { id: 126, title: "Om Namah Shivaya", artist: "Krishna Das", genre: "Devotional", spotify: "spotify:track:6sDGrRgG7hVHQZD2CYJa2P", youtube: "rSOwn5Zf9u4" },
      { id: 127, title: "Gayatri Mantra", artist: "Deva Premal", genre: "Spiritual", spotify: "spotify:track:1Q6M1hQpGh7gQi3gJJzDYy", youtube: "YnlsHt_1qUw" },
      { id: 128, title: "Shiva Moon", artist: "Prem Joshua", genre: "World Music", spotify: "spotify:track:5kZqRhZGq2GfPZJ3UYN2fD", youtube: "Q3oItpVa9fs" },
      { id: 129, title: "Mahamrityunjaya Mantra", artist: "Ravindra Jain", genre: "Devotional", spotify: "spotify:track:2pNb8UaQT5qS9H3fkLqG8w", youtube: "FqOYn2wlgNQ" },
      { id: 130, title: "Raghupati Raghav", artist: "Various Artists", genre: "Devotional", spotify: "spotify:track:4F8bNsQj6vZeEh3pBdPyRr", youtube: "lOKdM1XPRDA" },
    ],
    neutral: [
      { id: 131, title: "Jeene Laga Hoon", artist: "Atif Aslam, Shreya Ghoshal", genre: "Bollywood", spotify: "spotify:track:6xSKGPd4VNr1Y2LCbQwGkr", youtube: "HkzKGcKSX2k" },
      { id: 132, title: "Dil Chahta Hai", artist: "Shankar-Ehsaan-Loy", genre: "Bollywood", spotify: "spotify:track:7BMpLj6HQ6bHhJ6oF5ckHG", youtube: "PnLQbYW6t_I" },
      { id: 133, title: "Ikk Kudi", artist: "Alia Bhatt, Diljit Dosanjh", genre: "Bollywood", spotify: "spotify:track:1p7zFm3XpKgFnRV4pV3fDK", youtube: "3Pkb80YqQJM" },
      { id: 134, title: "Tere Naam", artist: "Udit Narayan", genre: "Bollywood", spotify: "spotify:track:5rPqHaDSJxKdKzHqZUQqJN", youtube: "nQvApnFN8aA" },
      { id: 135, title: "Channa Mereya", artist: "Arijit Singh", genre: "Bollywood", spotify: "spotify:track:1r8TDMM6qBGO0FMSGNt2DG", youtube: "bzSTpdcs-EI" },
    ],
  }
};

export const languageOptions = [
  { value: 'english', label: 'English', flag: '🇺🇸' },
  { value: 'hindi', label: 'हिंदी (Hindi)', flag: '🇮🇳' }
];

export const getMoodSongs = (language, mood) => {
  return musicDatabase[language]?.[mood] || musicDatabase.english.neutral;
};

export const getAllSongs = (language) => {
  const songs = musicDatabase[language] || musicDatabase.english;
  return Object.values(songs).flat();
};