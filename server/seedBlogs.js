import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './configs/db.js';
import Blog from './models/Blog.js';
import User from './models/User.js';

const sampleBlogs = [
  {
    title: "Life at MNNIT: A Freshman's Ultimate Survival Guide",
    subTitle: "Everything you need to know about hostels, mess, clubs, and thriving in your first year at MNNIT Allahabad.",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1280&auto=format&fit=crop",
    description: "<h2>Welcome to Motilal Nehru National Institute of Technology!</h2><p>Stepping through the main gates of MNNIT Allahabad in Teliarganj is the beginning of a transformative 4-year journey. Whether you're assigned to Swami Vivekananda Hostel (SVH) or Raman Hostel, the initial days can feel both exciting and overwhelming. Here is a curated guide to help every fresh batch navigate life on campus.</p><h3>1. The Hostel &amp; Mess Experience</h3><p>Hostel life teaches you independence. From late-night Maggie sessions at the canteen to group study marathons before mid-sems, your hostel mates will become family. Keep your room organized, be friendly with the hostel caretakers, and explore mess alternatives like the Student Activity Centre (SAC) cafe when you need a break.</p><h3>2. Exploring Technical and Cultural Clubs</h3><p>MNNIT boasts an active club ecosystem:</p><ul><li><strong>Computer Coding Club (CC Club):</strong> The hub for competitive programmers and open-source enthusiasts.</li><li><strong>Robotics Club:</strong> Hands-on bots, microcontrollers, and national competitions.</li><li><strong>Rotaract &amp; Literary Club:</strong> Debate, public speaking, and impactful community outreach.</li></ul><h3>3. Exploring Prayagraj</h3><p>Don't stay cooped up inside the campus on weekends! Head to Civil Lines for food, visit the sacred Triveni Sangam, and take an evening walk across Anand Bhavan. Balancing your academics with campus culture is the secret to an unforgettable college journey.</p>",
    isPublished: true
  },
  {
    title: "Avishkar: Inside MNNIT's Flagship Annual Tech Fest",
    subTitle: "A look into Northern India's largest technical festival, the robotics arena, hackathons, and guest lectures.",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1280&auto=format&fit=crop",
    description: "<h2>The Spirit of Innovation at MNNIT</h2><p>Every year, MNNIT Allahabad transforms into a tech haven during <strong>Avishkar</strong>, the institute's prestigious annual technical festival. Drawing thousands of participants across the country, Avishkar brings together coders, roboticists, designers, and innovators to compete and celebrate engineering excellence.</p><h3>Flagship Events That Define Avishkar</h3><ul><li><strong>CyberQuest:</strong> Flagship coding competitions including Insomnia (an all-night competitive programming battle) and SoftBlitz.</li><li><strong>Robomania:</strong> High-octane arena battles, line followers, and autonomous drone racing.</li><li><strong>Monopoly:</strong> Business pitching, fintech case studies, and startup plan presentations judged by angel investors.</li></ul><h3>Why You Should Participate</h3><p>Participating in Avishkar is more than just bagging prize money—it is about networking with peers from other IITs and NITs, testing your problem-solving under tight deadlines, and learning to collaborate under pressure.</p>",
    isPublished: true
  },
  {
    title: "Cracking Placements & Internships: A Roadmap for Engineers",
    subTitle: "Practical strategies from MNNIT seniors for DSA, system design, core subjects, and behavioral interviews.",
    category: "Startup",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1280&auto=format&fit=crop",
    description: "<h2>The Placement Blueprint from MNNIT Seniors</h2><p>MNNIT Allahabad has consistently had one of the strongest placement statistics among NITs. With top tech giants and startups visiting campus every season, having a structured roadmap from your second year onwards makes all the difference.</p><h3>Phase 1: Solidifying Data Structures and Algorithms (DSA)</h3><p>Start with a core programming language (C++ or Java). Master the fundamentals:</p><ol><li>Arrays, Strings, Two Pointers, and Sliding Window</li><li>Trees, Graphs, BFS/DFS, and Shortest Path algorithms</li><li>Dynamic Programming and Recursion patterns</li></ol><h3>Phase 2: Project Building and Core CS Subjects</h3><p>Build 2 standout full-stack or systems projects that solve real problems. Prepare Operating Systems (Processes, Threads, Virtual Memory), DBMS (SQL, Normalization, ACID properties), and Computer Networks thoroughly.</p><h3>Phase 3: Mock Interviews and Behavioral Rounds</h3><p>Practice speaking your thought process aloud. Companies look for problem-solving adaptability, humble demeanor, and clear communication.</p>",
    isPublished: true
  },
  {
    title: "Culrav: The Grand Cultural Spectacle of MNNIT",
    subTitle: "Reliving four days of high-voltage musical nights, choreography competitions, and dramatic performances.",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1280&auto=format&fit=crop",
    description: "<h2>The Magic of Culrav</h2><p>When the spring semester peaks, MNNIT swaps coding terminals for guitars, spotlights, and dance shoes. <strong>Culrav</strong> is MNNIT's flagship annual cultural festival, celebrating creativity and artistic expression.</p><h3>Unforgettable Highlights</h3><ul><li><strong>Razzmatazz &amp; Spandan:</strong> The inter-college dance and choreography face-offs that electrify the main auditorium.</li><li><strong>Rock Night:</strong> High-octane headlining bands bringing unforgettable live music to the open ground.</li><li><strong>Rangsaazi:</strong> Fine arts and graffiti displays adorning the campus walkways.</li></ul><p>Culrav creates memories that stay with alumni for decades. It is the time when batchmates come together, volunteers work tirelessly behind the scenes, and the campus truly comes alive.</p>",
    isPublished: true
  }
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    let author = await User.findOne({ email: "admin@example.com" });
    if (!author) {
      author = await User.findOne();
    }

    if (!author) {
      author = await User.create({
        name: "MNNIT Editorial",
        email: "editorial@mnnit.ac.in",
        password: "seeded_password_hash",
        isVerified: true
      });
      console.log("Created default editorial author");
    }

    console.log(`Using author: ${author.name} (${author._id})`);

    for (const blogData of sampleBlogs) {
      const existing = await Blog.findOne({ title: blogData.title });
      if (existing) {
        console.log(`Blog already exists: "${blogData.title}"`);
      } else {
        await Blog.create({
          ...blogData,
          writer: author._id
        });
        console.log(`Seeded: "${blogData.title}"`);
      }
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
