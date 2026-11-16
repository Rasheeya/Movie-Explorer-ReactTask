import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_MOVIES_DIR = path.resolve('public/assets/movies');
const SRC_MOVIES_DIR = path.resolve('src/assets/movies');

fs.mkdirSync(PUBLIC_MOVIES_DIR, { recursive: true });
fs.mkdirSync(SRC_MOVIES_DIR, { recursive: true });

async function resolveWikiUrl(wikiFile) {
  const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(wikiFile) + '&prop=imageinfo&iiprop=url&format=json';
  const res = await fetch(url, { headers: { 'User-Agent': 'StacklyMovieExplorer/1.0 (dev@stackly.tv)' } });
  const data = await res.json();
  const page = Object.values(data.query.pages)[0];
  if (!page || !page.imageinfo || !page.imageinfo[0]) {
    throw new Error('Image info not found for: ' + wikiFile);
  }
  return page.imageinfo[0].url;
}

async function downloadAndProcessImage(source, outputSlug, isBackdrop = false) {
  const filename = `${outputSlug}.webp`;
  const pubPath = path.join(PUBLIC_MOVIES_DIR, filename);
  const srcPath = path.join(SRC_MOVIES_DIR, filename);

  // If already exists and valid, skip
  if (fs.existsSync(pubPath)) {
    const stat = fs.statSync(pubPath);
    if (stat.size > 1000 && stat.size <= 90 * 1024) {
      return { filename, bytes: stat.size, kb: `${(stat.size / 1024).toFixed(1)} KB`, isUnder90kb: true, cached: true };
    }
  }

  let imgUrl = source;
  if (source.startsWith('File:')) {
    imgUrl = await resolveWikiUrl(source);
  }

  let res;
  for (let attempt = 1; attempt <= 4; attempt++) {
    res = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'StacklyCinemaPortfolio/2.0 (learning.project.contact@gmail.com)'
      }
    });
    if (res.status === 429) {
      console.log(`[HTTP 429 Rate Limit] Backing off for 3.5s before retry ${attempt}...`);
      await new Promise(r => setTimeout(r, 3500 * attempt));
      continue;
    }
    if (res.ok) break;
  }

  if (!res || !res.ok) {
    throw new Error(`Failed to fetch ${imgUrl} - HTTP ${res ? res.status : 'timeout'}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  const targetWidth = isBackdrop ? 1000 : 500;
  const targetHeight = isBackdrop ? 562 : 750;

  let quality = isBackdrop ? 72 : 80;
  let webpBuffer = await sharp(inputBuffer)
    .resize(targetWidth, targetHeight, { fit: 'cover', position: 'center' })
    .webp({ quality })
    .toBuffer();

  // Ensure strict <= 90kb constraint
  const MAX_BYTES = 90 * 1024; // 92160 bytes
  while (webpBuffer.length > MAX_BYTES && quality > 40) {
    quality -= 6;
    webpBuffer = await sharp(inputBuffer)
      .resize(targetWidth, targetHeight, { fit: 'cover', position: 'center' })
      .webp({ quality })
      .toBuffer();
  }

  fs.writeFileSync(pubPath, webpBuffer);
  fs.writeFileSync(srcPath, webpBuffer);

  const kb = (webpBuffer.length / 1024).toFixed(1);
  return { filename, bytes: webpBuffer.length, kb: `${kb} KB`, isUnder90kb: webpBuffer.length <= MAX_BYTES, cached: false };
}

export const MOVIE_DEFINITIONS = [
  // Tamil
  {
    id: 1,
    slug: 'leo',
    title: 'Leo',
    tagline: 'Bloody sweet.',
    year: 2023,
    releaseDate: 'October 19, 2023',
    rating: 7.8,
    voteCount: '135K',
    duration: '2h 44m',
    language: 'Tamil',
    genres: ['Action', 'Thriller', 'Crime'],
    director: 'Lokesh Kanagaraj',
    cast: ['Thalapathy Vijay', 'Trisha Krishnan', 'Sanjay Dutt', 'Arjun Sarja'],
    description: 'Parthiban is a mild-mannered café owner and animal rescuer in Thekkady. When dangerous gangsters mistake him for notorious enforcer Leo Das, he must go to extreme lengths to protect his family.',
    posterSource: 'File:Leo_(2023_Indian_film).jpg',
    trailerUrl: 'https://www.youtube.com/embed/Po3jStA673E',
    featured: true,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 2,
    slug: 'jailer',
    title: 'Jailer',
    tagline: 'Superstar returns in lethal fashion.',
    year: 2023,
    releaseDate: 'August 10, 2023',
    rating: 7.6,
    voteCount: '95K',
    duration: '2h 48m',
    language: 'Tamil',
    genres: ['Action', 'Comedy', 'Crime'],
    director: 'Nelson Dilipkumar',
    cast: ['Rajinikanth', 'Mohanlal', 'Shiva Rajkumar', 'Vinayakan', 'Ramya Krishnan'],
    description: 'Muthuvel Pandian, a retired police jailer, lives peacefully with his family. When his honest ACP son disappears investigating an idol smuggling ring, Muthuvel resurfaces his deadly past.',
    posterSource: 'File:Jailer_2023_Tamil_film_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/xenOE1Tma0A',
    featured: false,
    trending: true,
    popular: true,
    topRated: false
  },
  {
    id: 3,
    slug: 'vikram',
    title: 'Vikram',
    tagline: 'Once upon a time, there lived a ghost.',
    year: 2022,
    releaseDate: 'June 3, 2022',
    rating: 8.3,
    voteCount: '142K',
    duration: '2h 55m',
    language: 'Tamil',
    genres: ['Action', 'Thriller', 'Crime'],
    director: 'Lokesh Kanagaraj',
    cast: ['Kamal Haasan', 'Vijay Sethupathi', 'Fahadh Faasil', 'Suriya'],
    description: 'A black-ops squad led by Amar investigates a series of brutal masked killings of police officers, uncovering a massive drug syndicate controlled by Sandhanam and a legendary covert operative.',
    posterSource: 'File:Vikram_2022_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/OKBMCL-frPU',
    featured: false,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 4,
    slug: 'ponniyin-selvan',
    title: 'Ponniyin Selvan: I',
    tagline: 'The Cholas are coming.',
    year: 2022,
    releaseDate: 'September 30, 2022',
    rating: 7.6,
    voteCount: '78K',
    duration: '2h 47m',
    language: 'Tamil',
    genres: ['Action', 'Drama', 'History'],
    director: 'Mani Ratnam',
    cast: ['Vikram', 'Aishwarya Rai Bachchan', 'Jayam Ravi', 'Karthi', 'Trisha'],
    description: 'Vandiyathevan sets out across the Chola kingdom to deliver a message from Crown Prince Aditha Karikalan, unraveling a palace conspiracy to overthrow the rightful heir to the golden throne.',
    posterSource: 'File:Ponniyin_Selvan_I.jpg',
    trailerUrl: 'https://www.youtube.com/embed/D4qAQYLGZVM',
    featured: false,
    trending: false,
    popular: true,
    topRated: false
  },
  {
    id: 5,
    slug: 'kaithi',
    title: 'Kaithi',
    tagline: 'One night, one hero, countless foes.',
    year: 2019,
    releaseDate: 'October 25, 2019',
    rating: 8.5,
    voteCount: '89K',
    duration: '2h 25m',
    language: 'Tamil',
    genres: ['Action', 'Thriller', 'Crime'],
    director: 'Lokesh Kanagaraj',
    cast: ['Karthi', 'Narain', 'Dheena', 'George Maryan'],
    description: 'Dilli, an ex-convict on his way to see his daughter for the very first time, is recruited by an injured cop to drive a truck of unconscious policemen to a hospital while surrounded by armed gangsters.',
    posterSource: 'File:Kaithi_2019_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/g79Awe0vlM8',
    featured: false,
    trending: false,
    popular: true,
    topRated: true
  },

  // Telugu
  {
    id: 6,
    slug: 'rrr',
    title: 'RRR',
    tagline: 'Rise, Roar, Revolt.',
    year: 2022,
    releaseDate: 'March 25, 2022',
    rating: 8.8,
    voteCount: '210K',
    duration: '3h 07m',
    language: 'Telugu',
    genres: ['Action', 'Drama', 'Adventure'],
    director: 'S.S. Rajamouli',
    cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'],
    description: 'A fearless revolutionary and an officer in the British force develop a profound friendship before uncovering each other’s secret identities in pre-independence 1920s India.',
    posterSource: 'File:RRR_Poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/NgBoMJy386M',
    featured: true,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 7,
    slug: 'baahubali-2',
    title: 'Baahubali 2: The Conclusion',
    tagline: 'The epic climax of Mahishmati.',
    year: 2017,
    releaseDate: 'April 28, 2017',
    rating: 8.2,
    voteCount: '190K',
    duration: '2h 47m',
    language: 'Telugu',
    genres: ['Action', 'Drama', 'Fantasy'],
    director: 'S.S. Rajamouli',
    cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty', 'Tamannaah Bhatia'],
    description: 'When Shiva discovers his royal heritage as Mahendra Baahubali, he embarks on a glorious battle to avenge his father’s tragic death and reclaim the throne from tyrannical Bhallaladeva.',
    posterSource: 'File:Baahubali_2_The_Conclusion_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/G62HrubdD6o',
    featured: false,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 8,
    slug: 'kalki-2898-ad',
    title: 'Kalki 2898 AD',
    tagline: 'The future begins now.',
    year: 2024,
    releaseDate: 'June 27, 2024',
    rating: 7.6,
    voteCount: '105K',
    duration: '3h 01m',
    language: 'Telugu',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    director: 'Nag Ashwin',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Kamal Haasan', 'Deepika Padukone'],
    description: 'In a post-apocalyptic dystopia in the year 2898 AD, immortal warrior Ashwatthama awaits the arrival of Kalki, the tenth avatar of Vishnu, while bounty hunter Bhairava seeks his big ticket to the Complex.',
    posterSource: 'File:Kalki_2898_AD.jpg',
    trailerUrl: 'https://www.youtube.com/embed/kQDd1AhGIHk',
    featured: false,
    trending: true,
    popular: true,
    topRated: false
  },
  {
    id: 9,
    slug: 'pushpa',
    title: 'Pushpa: The Rise',
    tagline: 'Pushpa Raj will not bow down.',
    year: 2021,
    releaseDate: 'December 17, 2021',
    rating: 7.6,
    voteCount: '115K',
    duration: '2h 59m',
    language: 'Telugu',
    genres: ['Action', 'Crime', 'Drama'],
    director: 'Sukumar',
    cast: ['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil', 'Jagadeesh Prathap Bandari'],
    description: 'A laborer named Pushpa Raj rises through the ranks of a red sandalwood smuggling syndicate in the Seshachalam hills, battling ruthless syndicate bosses and a ruthless police superintendent.',
    posterSource: 'File:Pushpa_-_The_Rise_(2021_film).jpg',
    trailerUrl: 'https://www.youtube.com/embed/pKctjlpbipc',
    featured: false,
    trending: true,
    popular: true,
    topRated: false
  },
  {
    id: 10,
    slug: 'salaar',
    title: 'Salaar: Part 1 – Ceasefire',
    tagline: 'A blood-soaked bond of friendship.',
    year: 2023,
    releaseDate: 'December 22, 2023',
    rating: 7.5,
    voteCount: '80K',
    duration: '2h 55m',
    language: 'Telugu',
    genres: ['Action', 'Crime', 'Drama'],
    director: 'Prashanth Neel',
    cast: ['Prabhas', 'Prithviraj Sukumaran', 'Shruti Haasan', 'Jagapathi Babu'],
    description: 'Set in the crime-ridden city-state of Khansaar, a hardened fighter Deva honors a lifelong oath to protect his childhood companion Varadha, waging explosive war against royal warlords.',
    posterSource: 'File:Salaar_Part_1_–_Ceasefire.jpg',
    trailerUrl: 'https://www.youtube.com/embed/4GPvYMKtrtI',
    featured: false,
    trending: false,
    popular: true,
    topRated: false
  },

  // Hindi
  {
    id: 11,
    slug: 'jawan',
    title: 'Jawan',
    tagline: 'Ready chief?',
    year: 2023,
    releaseDate: 'September 7, 2023',
    rating: 7.8,
    voteCount: '150K',
    duration: '2h 49m',
    language: 'Hindi',
    genres: ['Action', 'Thriller'],
    director: 'Atlee',
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone'],
    description: 'A former prison warden and a dedicated women vigilante unit hijack public infrastructure to force systemic reform and expose corrupt oligarchs, while rediscovering a forgotten military hero.',
    posterSource: 'File:Jawan_film_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/MWOlnZSnXyg',
    featured: true,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 12,
    slug: '3-idiots',
    title: '3 Idiots',
    tagline: 'Chase excellence and success will follow.',
    year: 2009,
    releaseDate: 'December 25, 2009',
    rating: 8.4,
    voteCount: '440K',
    duration: '2h 50m',
    language: 'Hindi',
    genres: ['Comedy', 'Drama'],
    director: 'Rajkumar Hirani',
    cast: ['Aamir Khan', 'R. Madhavan', 'Sharman Joshi', 'Kareena Kapoor', 'Boman Irani'],
    description: 'Two friends embark on a road trip seeking their long-lost companion Rancho, recalling their college years at India’s top engineering institute and how he inspired them to follow their genuine passions.',
    posterSource: 'File:3_idiots_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/K0eDlFX9GMc',
    featured: false,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 13,
    slug: 'dangal',
    title: 'Dangal',
    tagline: 'Our daughters are no less than anyone.',
    year: 2016,
    releaseDate: 'December 23, 2016',
    rating: 8.3,
    voteCount: '230K',
    duration: '2h 41m',
    language: 'Hindi',
    genres: ['Biography', 'Drama', 'Sport'],
    director: 'Nitesh Tiwari',
    cast: ['Aamir Khan', 'Fatima Sana Shaikh', 'Sanya Malhotra', 'Sakshi Tanwar'],
    description: 'Former wrestler Mahavir Singh Phogat defies societal norms to train his daughters Geeta and Babita in freestyle wrestling, propelling them onto the international podium at the Commonwealth Games.',
    posterSource: 'File:Dangal_Poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/x_7YlGv9u1g',
    featured: false,
    trending: false,
    popular: true,
    topRated: true
  },
  {
    id: 14,
    slug: 'pathaan',
    title: 'Pathaan',
    tagline: 'Fasten your seatbelts, turbulence ahead.',
    year: 2023,
    releaseDate: 'January 25, 2023',
    rating: 7.0,
    voteCount: '130K',
    duration: '2h 26m',
    language: 'Hindi',
    genres: ['Action', 'Thriller'],
    director: 'Siddharth Anand',
    cast: ['Shah Rukh Khan', 'Deepika Padukone', 'John Abraham', 'Dimple Kapadia'],
    description: 'An exiled RAW field operative is called back into action to take down Jim, a former rogue agent leading a private mercenary outfit planning a devastating biological strike.',
    posterSource: 'File:Pathaan_film_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/vqu4z34wENw',
    featured: false,
    trending: true,
    popular: true,
    topRated: false
  },
  {
    id: 15,
    slug: 'brahmastra',
    title: 'Brahmāstra: Part One – Shiva',
    tagline: 'The Astraverse begins.',
    year: 2022,
    releaseDate: 'September 9, 2022',
    rating: 7.1,
    voteCount: '85K',
    duration: '2h 47m',
    language: 'Hindi',
    genres: ['Action', 'Fantasy', 'Adventure'],
    director: 'Ayan Mukerji',
    cast: ['Ranbir Kapoor', 'Alia Bhatt', 'Amitabh Bachchan', 'Mouni Roy'],
    description: 'Shiva, a Mumbai DJ with a mystical immunity to fire, uncovers his divine lineage as the wielder of the Agnyastra and joins the Brahmānsh order to safeguard the ultimate cosmic weapon.',
    posterSource: 'File:Brahmastra_Part_One_Shiva.jpg',
    trailerUrl: 'https://www.youtube.com/embed/BUjXzrgntDc',
    featured: false,
    trending: false,
    popular: true,
    topRated: false
  },

  // Malayalam
  {
    id: 16,
    slug: 'manjummel-boys',
    title: 'Manjummel Boys',
    tagline: 'Kanmani anbodu... a friend never leaves a friend.',
    year: 2024,
    releaseDate: 'February 22, 2024',
    rating: 8.3,
    voteCount: '62K',
    duration: '2h 15m',
    language: 'Malayalam',
    genres: ['Adventure', 'Drama', 'Thriller'],
    director: 'Chidambaram',
    cast: ['Soubin Shahir', 'Sreenath Bhasi', 'Balu Varghese', 'Ganapathi'],
    description: 'A group of close-knit friends from Kochi travel to Kodaikanal for vacation. When one slips into the uncharted depths of the perilous Guna Caves, the boys wage an unimaginable rescue effort.',
    posterSource: 'File:Manjummel_Boys_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/id848Ww1YLo',
    featured: true,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 17,
    slug: 'aavesham',
    title: 'Aavesham',
    tagline: 'Eda mone! Ranga anna has entered the chat.',
    year: 2024,
    releaseDate: 'April 11, 2024',
    rating: 7.9,
    voteCount: '58K',
    duration: '2h 38m',
    language: 'Malayalam',
    genres: ['Action', 'Comedy'],
    director: 'Jithu Madhavan',
    cast: ['Fahadh Faasil', 'Hipzster', 'Mithun Jai Shankar', 'Sajin Gopu'],
    description: 'Three college engineering students facing ragging in Bangalore befriend an eccentric, all-white-clad Malayali gangster named Ranga to get protection, only to find themselves swept into his chaotic underworld.',
    posterSource: 'File:Aavesham.jpg',
    trailerUrl: 'https://www.youtube.com/embed/L0yEMl8PXnw',
    featured: false,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 18,
    slug: 'premalu',
    title: 'Premalu',
    tagline: 'Hyderabad love story packed with limitless laughs.',
    year: 2024,
    releaseDate: 'February 9, 2024',
    rating: 7.8,
    voteCount: '45K',
    duration: '2h 36m',
    language: 'Malayalam',
    genres: ['Comedy', 'Romance'],
    director: 'Girish A.D.',
    cast: ['Naslen K. Gafoor', 'Mamitha Baiju', 'Shyam Mohan', 'Sangeeth Prathap'],
    description: 'Sachin, who dreams of moving to the UK, relocates to Hyderabad for GATE coaching and falls head-over-heels for Reenu, leading to hilarious misadventures and heartwarming romantic pursuits.',
    posterSource: 'File:Premalu_film_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/2M34fHq5Cbg',
    featured: false,
    trending: true,
    popular: true,
    topRated: false
  },
  {
    id: 19,
    slug: 'bramayugam',
    title: 'Bramayugam',
    tagline: 'The age of darkness.',
    year: 2024,
    releaseDate: 'February 15, 2024',
    rating: 7.9,
    voteCount: '38K',
    duration: '2h 19m',
    language: 'Malayalam',
    genres: ['Horror', 'Mystery', 'Thriller'],
    director: 'Rahul Sadasivan',
    cast: ['Mammootty', 'Arjun Ashokan', 'Sidharth Bharathan'],
    description: 'A folk singer fleeing slavery stumbles upon a decaying ancestral mansion ruled by a sinister feudal patriarch, only to realize he has stepped into a trap woven by an ancient malevolent spirit.',
    posterSource: 'File:Bramayugam_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/a9rZkVw00cQ',
    featured: false,
    trending: false,
    popular: true,
    topRated: true
  },
  {
    id: 20,
    slug: 'lucifer',
    title: 'Lucifer',
    tagline: 'Blood, brotherhood, betrayal.',
    year: 2019,
    releaseDate: 'March 28, 2019',
    rating: 7.5,
    voteCount: '52K',
    duration: '2h 55m',
    language: 'Malayalam',
    genres: ['Action', 'Crime', 'Drama'],
    director: 'Prithviraj Sukumaran',
    cast: ['Mohanlal', 'Vivek Oberoi', 'Manju Warrier', 'Tovino Thomas'],
    description: 'Following the sudden demise of Kerala’s Chief Minister, political wolves scramble to usurp power until Stephen Nedumpally, a mysterious enforcer with global syndicate ties, steps in to restore balance.',
    posterSource: 'File:Lucifer_film_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/d2w1Lq9Q5uM',
    featured: false,
    trending: false,
    popular: true,
    topRated: false
  },

  // Kannada
  {
    id: 21,
    slug: 'kgf-2',
    title: 'K.G.F: Chapter 2',
    tagline: 'Violence, violence, violence... I avoid, but violence likes me.',
    year: 2022,
    releaseDate: 'April 14, 2022',
    rating: 8.3,
    voteCount: '175K',
    duration: '2h 48m',
    language: 'Kannada',
    genres: ['Action', 'Crime', 'Drama'],
    director: 'Prashanth Neel',
    cast: ['Yash', 'Sanjay Dutt', 'Raveena Tandon', 'Srinidhi Shetty'],
    description: 'The blood-soaked land of Kolar Gold Fields now has a new sovereign in Rocky, who must defend his supremacy against brutal warlord Adheera and Indian Prime Minister Ramika Sen.',
    posterSource: 'File:K.G.F_Chapter_2.jpg',
    trailerUrl: 'https://www.youtube.com/embed/JKa05nyUmuQ',
    featured: true,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 22,
    slug: 'kantara',
    title: 'Kantara',
    tagline: 'A legend of divine wrath and indigenous roots.',
    year: 2022,
    releaseDate: 'September 30, 2022',
    rating: 8.2,
    voteCount: '110K',
    duration: '2h 28m',
    language: 'Kannada',
    genres: ['Action', 'Adventure', 'Drama'],
    director: 'Rishab Shetty',
    cast: ['Rishab Shetty', 'Sapthami Gowda', 'Kishore', 'Achyuth Kumar'],
    description: 'In coastal Karnataka, a fierce Kambala champion Shiva clashes with an uncompromising forest officer, igniting an ancient conflict that awakens the ferocious spirit of the Panjurli deity.',
    posterSource: 'File:Kantara_poster.jpeg',
    trailerUrl: 'https://www.youtube.com/embed/8mrVmf239GU',
    featured: false,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 23,
    slug: '777-charlie',
    title: '777 Charlie',
    tagline: 'A lonely soul transformed by unconditional canine love.',
    year: 2022,
    releaseDate: 'June 10, 2022',
    rating: 8.8,
    voteCount: '48K',
    duration: '2h 44m',
    language: 'Kannada',
    genres: ['Adventure', 'Comedy', 'Drama'],
    director: 'Kiranraj K',
    cast: ['Rakshit Shetty', 'Charlie', 'Sangeetha Sringeri', 'Raj B. Shetty'],
    description: 'Dharma lives a reclusive, joyless existence in Bengaluru until an abused runaway Labrador pup walks into his home, inspiring a life-affirming motorcycle expedition all the way to Kashmir.',
    posterSource: 'File:777_Charlie_official_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/mKkEP_P8B14',
    featured: false,
    trending: false,
    popular: true,
    topRated: true
  },

  // Korean
  {
    id: 24,
    slug: 'parasite',
    title: 'Parasite',
    tagline: 'Act like you own the place.',
    year: 2019,
    releaseDate: 'November 8, 2019',
    rating: 8.5,
    voteCount: '920K',
    duration: '2h 12m',
    language: 'Korean',
    genres: ['Drama', 'Thriller', 'Comedy'],
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik', 'Park So-dam'],
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan in this Oscar-winning masterpiece.',
    posterSource: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    trailerUrl: 'https://www.youtube.com/embed/5xH0RZE9jp4',
    featured: false,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 25,
    slug: 'train-to-busan',
    title: 'Train to Busan',
    tagline: 'Life-or-death ride on the bullet train.',
    year: 2016,
    releaseDate: 'July 20, 2016',
    rating: 7.6,
    voteCount: '310K',
    duration: '1h 58m',
    language: 'Korean',
    genres: ['Action', 'Horror', 'Thriller'],
    director: 'Yeon Sang-ho',
    cast: ['Gong Yoo', 'Ma Dong-seok', 'Jung Yu-mi', 'Kim Su-an'],
    description: 'While a zombie virus breaks out in South Korea, passengers on a high-speed train from Seoul to Busan struggle for survival as the infected overrun city after city.',
    posterSource: 'File:Train_to_Busan.jpg',
    trailerUrl: 'https://www.youtube.com/embed/pyWuHv2-Abk',
    featured: false,
    trending: true,
    popular: true,
    topRated: false
  },
  {
    id: 26,
    slug: 'oldboy',
    title: 'Oldboy',
    tagline: '15 years of imprisonment. 5 days of vengeance.',
    year: 2003,
    releaseDate: 'November 21, 2003',
    rating: 8.4,
    voteCount: '620K',
    duration: '2h 00m',
    language: 'Korean',
    genres: ['Action', 'Drama', 'Mystery'],
    director: 'Park Chan-wook',
    cast: ['Choi Min-sik', 'Yoo Ji-tae', 'Kang Hye-jung'],
    description: 'After being kidnapped and imprisoned for fifteen years for reasons unknown, Oh Dae-su is released and must find his captor in five days to uncover a devastating secret.',
    posterSource: 'https://image.tmdb.org/t/p/w500/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg',
    trailerUrl: 'https://www.youtube.com/embed/2HkjrJ6IK5E',
    featured: false,
    trending: false,
    popular: true,
    topRated: true
  },
  {
    id: 27,
    slug: 'decision-to-leave',
    title: 'Decision to Leave',
    tagline: 'The closer you look, the harder it is to see.',
    year: 2022,
    releaseDate: 'June 29, 2022',
    rating: 7.3,
    voteCount: '78K',
    duration: '2h 18m',
    language: 'Korean',
    genres: ['Crime', 'Drama', 'Mystery'],
    director: 'Park Chan-wook',
    cast: ['Tang Wei', 'Park Hae-il', 'Lee Jung-hyun'],
    description: 'A polite detective investigating a man’s fatal fall from a mountain peak develops a deep romantic obsession with the primary suspect: the dead man’s enigmatic Chinese wife.',
    posterSource: 'File:Decision_to_Leave_film_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/BanyEQP1mK8',
    featured: false,
    trending: false,
    popular: false,
    topRated: false
  },
  {
    id: 28,
    slug: 'past-lives',
    title: 'Past Lives',
    tagline: 'In-Yun: Destiny across lifetimes.',
    year: 2023,
    releaseDate: 'June 2, 2023',
    rating: 7.9,
    voteCount: '155K',
    duration: '1h 46m',
    language: 'Korean',
    genres: ['Drama', 'Romance'],
    director: 'Celine Song',
    cast: ['Greta Lee', 'Teo Yoo', 'John Magaro'],
    description: 'Nora and Hae Sung, two deeply connected childhood friends, are separated after her family emigrates from South Korea, only to be reunited two decades later for one fateful week in New York.',
    posterSource: 'https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg',
    trailerUrl: 'https://www.youtube.com/embed/kA244xewjcI',
    featured: false,
    trending: false,
    popular: true,
    topRated: true
  },

  // English
  {
    id: 29,
    slug: 'dune-2',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    year: 2024,
    releaseDate: 'March 1, 2024',
    rating: 8.6,
    voteCount: '420K',
    duration: '2h 46m',
    language: 'English',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, endeavoring to prevent a terrible future only he can foresee.',
    posterSource: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: true,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 30,
    slug: 'oppenheimer',
    title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    year: 2023,
    releaseDate: 'July 21, 2023',
    rating: 8.9,
    voteCount: '740K',
    duration: '3h 00m',
    language: 'English',
    genres: ['Drama', 'History', 'Biography'],
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral complexity of the atomic age.',
    posterSource: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    featured: true,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 31,
    slug: 'interstellar',
    title: 'Interstellar',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    year: 2014,
    releaseDate: 'November 7, 2014',
    rating: 8.7,
    voteCount: '2.1M',
    duration: '2h 49m',
    language: 'English',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    description: 'When Earth faces extinction, a team of courageous explorers travels through a wormhole near Saturn in search of a new habitable sanctuary for mankind.',
    posterSource: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    featured: false,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 32,
    slug: 'the-dark-knight',
    title: 'The Dark Knight',
    tagline: 'Why so serious?',
    year: 2008,
    releaseDate: 'July 18, 2008',
    rating: 9.0,
    voteCount: '2.9M',
    duration: '2h 32m',
    language: 'English',
    genres: ['Action', 'Crime', 'Drama'],
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine', 'Gary Oldman'],
    description: 'When the menace known as the Joker wreaks havoc and chaos on Gotham City, Batman must accept one of the greatest psychological and physical tests of his heroic crusade.',
    posterSource: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
    featured: false,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 33,
    slug: 'inception',
    title: 'Inception',
    tagline: 'Your mind is the scene of the crime.',
    year: 2010,
    releaseDate: 'July 16, 2010',
    rating: 8.8,
    voteCount: '2.6M',
    duration: '2h 28m',
    language: 'English',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the subconscious mind of a CEO.',
    posterSource: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
    featured: false,
    trending: false,
    popular: true,
    topRated: true
  },
  {
    id: 34,
    slug: 'avengers-endgame',
    title: 'Avengers: Endgame',
    tagline: 'Part of the journey is the end.',
    year: 2019,
    releaseDate: 'April 26, 2019',
    rating: 8.4,
    voteCount: '1.3M',
    duration: '3h 01m',
    language: 'English',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    director: 'Anthony Russo, Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos’ actions and restore order.',
    posterSource: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    trailerUrl: 'https://www.youtube.com/embed/TcMBFSGVi1c',
    featured: false,
    trending: true,
    popular: true,
    topRated: false
  },
  {
    id: 35,
    slug: 'deadpool-and-wolverine',
    title: 'Deadpool & Wolverine',
    tagline: 'Come together.',
    year: 2024,
    releaseDate: 'July 26, 2024',
    rating: 7.8,
    voteCount: '340K',
    duration: '2h 08m',
    language: 'English',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
    description: 'Deadpool’s peaceful existence comes crashing down when the Time Variance Authority recruits him to protect the multiverse, uniting him with a reluctant Wolverine.',
    posterSource: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    trailerUrl: 'https://www.youtube.com/embed/73_1biulkYk',
    featured: false,
    trending: true,
    popular: true,
    topRated: false
  },
  {
    id: 36,
    slug: 'gladiator-2',
    title: 'Gladiator II',
    tagline: 'What we do in life echoes in eternity.',
    year: 2024,
    releaseDate: 'November 22, 2024',
    rating: 7.6,
    voteCount: '180K',
    duration: '2h 28m',
    language: 'English',
    genres: ['Action', 'Adventure', 'Drama'],
    director: 'Ridley Scott',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    description: 'Years after witnessing the death of Maximus, Lucius must enter the Colosseum after his home is conquered by tyrannical emperors who lead Rome with an iron fist.',
    posterSource: 'File:Gladiator_II_(2024)_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/4rgYUipGJNo',
    featured: false,
    trending: true,
    popular: true,
    topRated: false
  },

  // Animation / Cartoon
  {
    id: 37,
    slug: 'spider-man-spider-verse',
    title: 'Spider-Man: Across the Spider-Verse',
    tagline: 'It\'s how you wear the mask that matters.',
    year: 2023,
    releaseDate: 'June 2, 2023',
    rating: 8.7,
    voteCount: '580K',
    duration: '2h 20m',
    language: 'Animation',
    genres: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    description: 'Miles Morales catapults across the Multiverse, where he encounters a society of Spider-People charged with protecting its existence before clashing over moral principles.',
    posterSource: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
    featured: true,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 38,
    slug: 'spirited-away',
    title: 'Spirited Away',
    tagline: 'Nothing that happens is ever forgotten, even if you can\'t remember.',
    year: 2001,
    releaseDate: 'July 20, 2001',
    rating: 8.6,
    voteCount: '810K',
    duration: '2h 05m',
    language: 'Animation',
    genres: ['Animation', 'Adventure', 'Family', 'Fantasy'],
    director: 'Hayao Miyazaki',
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki', 'Takashi Naito'],
    description: 'During her family’s move to the suburbs, a somber 10-year-old girl wanders into an enchanting spirit world ruled by witches, gods, and spirits, working to free her cursed parents.',
    posterSource: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    trailerUrl: 'https://www.youtube.com/embed/ByXuk9QqQkk',
    featured: false,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 39,
    slug: 'the-lion-king',
    title: 'The Lion King',
    tagline: 'Life\'s greatest adventure is finding your place in the Circle of Life.',
    year: 1994,
    releaseDate: 'June 24, 1994',
    rating: 8.5,
    voteCount: '1.2M',
    duration: '1h 28m',
    language: 'Animation',
    genres: ['Animation', 'Adventure', 'Drama'],
    director: 'Roger Allers, Rob Minkoff',
    cast: ['Matthew Broderick', 'Jeremy Irons', 'James Earl Jones', 'Nathan Lane'],
    description: 'Lion prince Simba and his father are targeted by his bitter uncle Scar, who plots to ascend the throne himself. Guided by memorable companions, Simba grows up to claim his royal destiny.',
    posterSource: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
    trailerUrl: 'https://www.youtube.com/embed/lFzVJEksoDY',
    featured: false,
    trending: true,
    popular: true,
    topRated: true
  },
  {
    id: 40,
    slug: 'coco',
    title: 'Coco',
    tagline: 'The celebration of a lifetime.',
    year: 2017,
    releaseDate: 'November 22, 2017',
    rating: 8.4,
    voteCount: '610K',
    duration: '1h 45m',
    language: 'Animation',
    genres: ['Animation', 'Adventure', 'Family', 'Comedy'],
    director: 'Lee Unkrich',
    cast: ['Anthony Gonzalez', 'Gael García Bernal', 'Benjamin Bratt', 'Alanna Ubach'],
    description: 'Aspiring young musician Miguel, confronted with his family\'s ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.',
    posterSource: 'File:Coco_(2017_film)_poster.jpg',
    trailerUrl: 'https://www.youtube.com/embed/xlnPHQ3TLX8',
    featured: false,
    trending: false,
    popular: true,
    topRated: true
  },
  {
    id: 41,
    slug: 'inside-out-2',
    title: 'Inside Out 2',
    tagline: 'Make room for new emotions.',
    year: 2024,
    releaseDate: 'June 14, 2024',
    rating: 7.7,
    voteCount: '220K',
    duration: '1h 36m',
    language: 'Animation',
    genres: ['Animation', 'Adventure', 'Comedy'],
    director: 'Kelsey Mann',
    cast: ['Amy Poehler', 'Maya Hawke', 'Kensington Tallman', 'Liza Lapira'],
    description: 'Teenager Riley\'s headquarters undergoes a sudden demolition to make room for unexpected emotions: Anxiety, Envy, Ennui, and Embarrassment join Joy and Sadness.',
    posterSource: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    trailerUrl: 'https://www.youtube.com/embed/LEjhY15eCx0',
    featured: false,
    trending: true,
    popular: true,
    topRated: false
  },
  {
    id: 42,
    slug: 'kung-fu-panda',
    title: 'Kung Fu Panda',
    tagline: 'Prepare for awesomeness.',
    year: 2008,
    releaseDate: 'June 6, 2008',
    rating: 7.6,
    voteCount: '530K',
    duration: '1h 32m',
    language: 'Animation',
    genres: ['Animation', 'Action', 'Adventure', 'Comedy'],
    director: 'Mark Osborne, John Stevenson',
    cast: ['Jack Black', 'Dustin Hoffman', 'Angelina Jolie', 'Ian McShane'],
    description: 'Po, a clumsy panda working in his family’s noodle shop, is chosen as the Dragon Warrior and must master ancient kung fu to defend the Valley of Peace against fierce Tai Lung.',
    posterSource: 'File:kungfupanda.jpg',
    trailerUrl: 'https://www.youtube.com/embed/PXYG8h4HhXU',
    featured: false,
    trending: false,
    popular: true,
    topRated: false
  }
];

async function main() {
  console.log(`Starting conversion of ${MOVIE_DEFINITIONS.length} movie posters to WebP (Target <= 90KB)...`);
  const results = [];

  for (let i = 0; i < MOVIE_DEFINITIONS.length; i++) {
    const movie = MOVIE_DEFINITIONS[i];
    try {
      const res = await downloadAndProcessImage(movie.posterSource, movie.slug, false);
      results.push({ ...movie, ...res });
      console.log(`[${i + 1}/${MOVIE_DEFINITIONS.length}] ${movie.title} (${movie.language}) -> ${res.filename} [${res.kb}] - Under 90KB: ${res.isUnder90kb}`);
    } catch (err) {
      console.error(`Failed ${movie.title}:`, err.message);
    }
    // Brief courtesy delay for rate-limits
    await new Promise(r => setTimeout(r, 1000));
  }

  // Also download & convert backdrops for all 8 featured hero carousel movies
  const heroMovies = [
    { slug: 'leo', url: 'https://image.tmdb.org/t/p/w1280/2XUHC4lp3tDsgfFLFygNZ2x2Um9.jpg' },
    { slug: 'rrr', url: 'https://image.tmdb.org/t/p/w1280/i0Y0wP8H6SRgjr6QmuwbtQbS24D.jpg' },
    { slug: 'jawan', url: 'https://image.tmdb.org/t/p/w1280/5LtSjMNw6j3LkG29Oa4O0iY5U8.jpg' },
    { slug: 'kgf-2', url: 'https://image.tmdb.org/t/p/w1280/nsV5Mfi9FAV4w8eDsdr7uqVswOk.jpg' },
    { slug: 'manjummel-boys', url: 'https://image.tmdb.org/t/p/w1280/zGsHpuMN412VyzJZZnQeq4lMdjF.jpg' },
    { slug: 'dune-2', url: 'https://image.tmdb.org/t/p/w1280/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' },
    { slug: 'oppenheimer', url: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg' },
    { slug: 'spider-man-spider-verse', url: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg' }
  ];

  console.log('\nProcessing hero backdrops to WebP (Target <= 90KB)...');
  for (const hero of heroMovies) {
    try {
      const res = await downloadAndProcessImage(hero.url, `${hero.slug}-backdrop`, true);
      console.log(`Hero Backdrop: ${hero.slug} -> ${res.filename} [${res.kb}] - Under 90KB: ${res.isUnder90kb}`);
    } catch (e) {
      console.error(`Failed backdrop ${hero.slug}:`, e.message);
    }
  }

  // Now generate src/data/moviesData.js
  const moviesList = MOVIE_DEFINITIONS.map(m => ({
    id: m.id,
    title: m.title,
    slug: m.slug,
    tagline: m.tagline,
    year: m.year,
    releaseDate: m.releaseDate,
    rating: m.rating,
    voteCount: m.voteCount,
    duration: m.duration,
    language: m.language,
    genres: m.genres,
    director: m.director,
    cast: m.cast,
    description: m.description,
    poster: '/assets/movies/' + m.slug + '.webp',
    backdrop: ['leo', 'rrr', 'jawan', 'manjummel-boys', 'kgf-2', 'dune-2', 'oppenheimer', 'spider-man-spider-verse'].includes(m.slug)
      ? '/assets/movies/' + m.slug + '-backdrop.webp'
      : '/assets/movies/' + m.slug + '.webp',
    trailerUrl: m.trailerUrl,
    featured: m.featured,
    trending: m.trending,
    popular: m.popular,
    topRated: m.topRated
  }));

  const moviesDataCode = `// Stackly Movie Explorer - Curated Multilingual Movie Dataset
// Includes Tamil, Hindi, Malayalam, Telugu, Korean, English, Kannada, and Animation blockbusters
// All posters and backdrops converted to WebP format strictly <= 90KB

export const MOVIES_DATA = ${JSON.stringify(moviesList, null, 2)};

export const ALL_GENRES = [
  'All',
  'Action',
  'Sci-Fi',
  'Adventure',
  'Drama',
  'Comedy',
  'Crime',
  'Thriller',
  'Animation',
  'Fantasy',
  'History',
  'Biography',
  'Horror',
  'Romance'
];

export const ALL_LANGUAGES = [
  'All',
  'Tamil',
  'Telugu',
  'Hindi',
  'Malayalam',
  'Kannada',
  'Korean',
  'English',
  'Animation'
];
`;

  fs.writeFileSync('d:/Movie Explorer/src/data/moviesData.js', moviesDataCode);
  console.log('\nSuccessfully generated d:/Movie Explorer/src/data/moviesData.js!');
}

main().catch(console.error);
