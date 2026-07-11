const email1 = 'seeder1@example.com';
const email2 = 'seeder2@example.com';
const password = 'password123';
const baseUrl = 'https://tenangin.syahrulawaludin.my.id/api/v1';

async function request(endpoint, method, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error?.message || 'Error');
  return data;
}

async function registerOrLogin(name, email) {
  try {
    await request('/auth/register', 'POST', { name, email, password });
  } catch (e) {
    // maybe already exists
  }
  const data = await request('/auth/login', 'POST', { email, password });
  return data.accessToken;
}

async function main() {
  console.log('Logging in seed users...');
  const token1 = await registerOrLogin('Budi Seeder', email1);
  const token2 = await registerOrLogin('Siti Seeder', email2);
  
  const postsData = [
    { subject: 'Bagaimana cara mengatasi rasa cemas berlebih saat bekerja?', content: 'Halo teman-teman, akhir-akhir ini saya sering merasa cemas ketika mendekati deadline kerja.', mood: 'Anxious' },
    { subject: 'Mencoba teknik mindfulness 5-4-3-2-1', content: 'Hari ini saya mencoba teknik 5-4-3-2-1 ketika panik, dan ternyata lumayan membantu!', mood: 'Calm' },
    { subject: 'Susah tidur nyenyak, apakah ada rekomendasi musik?', content: 'Setiap malam rasanya pikiran saya terus berlari. Ada yang punya playlist musik khusus untuk tidur atau sleep cast yang bagus?', mood: 'Tired' },
    { subject: 'Akhirnya bisa berdamai dengan masa lalu', content: 'Butuh waktu berbulan-bulan untuk akhirnya saya bisa mengikhlaskan kejadian pahit tahun lalu.', mood: 'Happy' },
    { subject: 'Overthinking sebelum wawancara kerja besok', content: 'Besok ada wawancara kerja yang sudah lama saya nantikan, tapi sekarang pikiran saya overthinking.', mood: 'Stressed' },
    { subject: 'Sering merasa tidak cukup baik', content: 'Kadang melihat pencapaian orang lain bikin saya merasa minder dan kurang. Bagaimana ya cara fokus pada diri sendiri?', mood: 'Anxious' },
    { subject: 'Menikmati secangkir kopi pagi', content: 'Belajar untuk hadir secara utuh saat menyeruput kopi di pagi hari, tanpa memikirkan beban pekerjaan. Rasanya luar biasa.', mood: 'Calm' },
    { subject: 'Burnout dengan rutinitas harian', content: 'Setiap hari terasa sama, bangun, kerja, tidur. Ingin rasanya mencari hobi baru tapi tenaga sudah habis duluan.', mood: 'Tired' }
  ];

  console.log('Creating posts...');
  const createdPosts = [];
  for (let i = 0; i < postsData.length; i++) {
    const token = i % 2 === 0 ? token1 : token2;
    const res = await request('/posts', 'POST', postsData[i], token);
    const post = res.data;
    createdPosts.push(post);
    console.log(`- Created post: ${postsData[i].subject}`);
  }

  console.log('Adding likes and comments...');
  for (let i = 0; i < createdPosts.length; i++) {
    const post = createdPosts[i];
    
    // User 1 likes and comments
    try { await request(`/posts/${post.id}/like`, 'POST', null, token1); } catch(e){}
    try { await request(`/posts/${post.id}/comments`, 'POST', { text: 'Wah, terima kasih banyak atas ceritanya! Sangat relate.' }, token1); } catch(e){}
    
    // User 2 likes and comments
    try { await request(`/posts/${post.id}/like`, 'POST', null, token2); } catch(e){}
    try { await request(`/posts/${post.id}/comments`, 'POST', { text: 'Semangat! Semoga ke depannya jauh lebih baik ya.' }, token2); } catch(e){}
    
    console.log(`- Added likes & comments to: ${post.subject}`);
  }

  console.log('Seed via API completed successfully!');
}

main().catch(console.error);
