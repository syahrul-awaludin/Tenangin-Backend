const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tenangin_db',
  });

  console.log('Connected to MySQL directly.');

  // Fetch users
  const [users] = await connection.execute('SELECT id, name FROM User LIMIT 2');
  
  if (users.length === 0) {
    console.log('No users found in database! Please register a user first.');
    await connection.end();
    return;
  }

  const user = users[0];
  const user2 = users.length > 1 ? users[1] : users[0];

  console.log(`Using users: ${user.name} and ${user2.name}`);

  // Create some posts
  const postsData = [
    {
      subject: 'Bagaimana cara mengatasi rasa cemas berlebih saat bekerja?',
      content: 'Halo teman-teman, akhir-akhir ini saya sering merasa cemas ketika mendekati deadline kerja. Ada yang punya tips untuk mengelola ini dengan baik? Saya sudah mencoba meditasi tapi kadang masih muncul rasa deg-degan.',
      mood: 'Anxious',
    },
    {
      subject: 'Mencoba teknik mindfulness 5-4-3-2-1',
      content: 'Hari ini saya mencoba teknik 5-4-3-2-1 ketika panik, dan ternyata lumayan membantu! Untuk yang belum tahu, ini teknik di mana kita menyebutkan 5 hal yang dilihat, 4 disentuh, 3 didengar, 2 dicium aromanya, dan 1 dirasa di mulut. Sangat direkomendasikan.',
      mood: 'Calm',
    },
    {
      subject: 'Susah tidur nyenyak, apakah ada rekomendasi musik?',
      content: 'Setiap malam rasanya pikiran saya terus berlari. Ada yang punya playlist musik khusus untuk tidur atau sleep cast yang bagus? Tolong bagikan link-nya ya, terima kasih banyak.',
      mood: 'Tired',
    },
    {
      subject: 'Akhirnya bisa berdamai dengan masa lalu',
      content: 'Butuh waktu berbulan-bulan untuk akhirnya saya bisa mengikhlaskan kejadian pahit tahun lalu. Prosesnya tidak mudah, penuh air mata, tapi percayalah waktu benar-benar menyembuhkan. Semangat untuk teman-teman yang sedang berjuang!',
      mood: 'Happy',
    },
    {
      subject: 'Overthinking sebelum wawancara kerja besok',
      content: 'Besok ada wawancara kerja yang sudah lama saya nantikan, tapi sekarang pikiran saya overthinking takut gagal. Bagaimana cara meyakinkan diri sendiri agar bisa lebih tenang besok?',
      mood: 'Stressed',
    }
  ];

  console.log('Seeding posts...');
  
  const createdPosts = [];
  const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // format for MySQL

  for (let i = 0; i < postsData.length; i++) {
    const post = postsData[i];
    const postId = uuidv4();
    const authorId = i % 2 === 0 ? user.id : user2.id;
    
    await connection.execute(
      'INSERT INTO Post (id, subject, content, mood, createdAt, updatedAt, authorId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [postId, post.subject, post.content, post.mood, now, now, authorId]
    );
    
    post.id = postId;
    createdPosts.push(post);
    console.log(`Created post: ${post.subject}`);
  }

  console.log('Seeding comments & likes...');

  for (let i = 0; i < createdPosts.length; i++) {
    const post = createdPosts[i];
    
    // Add Like 1
    await connection.execute(
      'INSERT INTO `Like` (id, postId, userId) VALUES (?, ?, ?)',
      [uuidv4(), post.id, user.id]
    );

    // Add Like 2 if different user
    if (user.id !== user2.id) {
      await connection.execute(
        'INSERT INTO `Like` (id, postId, userId) VALUES (?, ?, ?)',
        [uuidv4(), post.id, user2.id]
      );
    }

    // Add Comment 1
    await connection.execute(
      'INSERT INTO Comment (id, text, createdAt, updatedAt, postId, authorId) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), 'Terima kasih atas sharingnya, sangat bermanfaat bagi saya saat ini!', now, now, post.id, user2.id]
    );

    // Add Comment 2
    await connection.execute(
      'INSERT INTO Comment (id, text, createdAt, updatedAt, postId, authorId) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), 'Semangat terus ya, kamu pasti bisa melewatinya. Kita di sini saling mendukung.', now, now, post.id, user.id]
    );
  }

  console.log('Seeding completed successfully!');
  await connection.end();
}

main().catch(console.error);
