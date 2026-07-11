const prisma = require('../src/config/prisma');

async function main() {
  // Fetch existing users to use as authors
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log('No users found. Please create a user first before seeding posts.');
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
  for (let i = 0; i < postsData.length; i++) {
    const post = await prisma.post.create({
      data: {
        ...postsData[i],
        authorId: i % 2 === 0 ? user.id : user2.id,
      },
    });
    createdPosts.push(post);
    console.log(`Created post: ${post.subject}`);
  }

  console.log('Seeding comments & likes...');

  // Add comments and likes to the posts
  for (let i = 0; i < createdPosts.length; i++) {
    const post = createdPosts[i];
    
    // Add Like
    await prisma.like.create({
      data: {
        postId: post.id,
        userId: user.id,
      },
    });

    if (user.id !== user2.id) {
      await prisma.like.create({
        data: {
          postId: post.id,
          userId: user2.id,
        },
      });
    }

    // Add Comment
    await prisma.comment.create({
      data: {
        text: 'Terima kasih atas sharingnya, sangat bermanfaat bagi saya saat ini!',
        postId: post.id,
        authorId: user2.id,
      },
    });

    await prisma.comment.create({
      data: {
        text: 'Semangat terus ya, kamu pasti bisa melewatinya. Kita di sini saling mendukung.',
        postId: post.id,
        authorId: user.id,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
