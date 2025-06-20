import { db } from "./db";
import { projects, techStack } from "@shared/schema";

async function seedData() {
  console.log("Seeding data...");

  // Seed projects
  const projectsData = [
    {
      title: "NextCommerce",
      description: "A full-featured e-commerce platform built with Next.js, featuring real-time inventory, payment integration, and advanced analytics dashboard.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      category: "web-app",
      tags: ["Next.js", "React", "TypeScript", "Tailwind", "MongoDB", "Stripe"],
      primaryTags: ["Next.js", "Stripe"],
      demoUrl: "#",
      githubUrl: "#",
      sortOrder: 1
    },
    {
      title: "TaskFlow Pro",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      category: "web-app",
      tags: ["Next.js", "Socket.io", "DnD Kit", "PostgreSQL"],
      primaryTags: ["React", "Firebase"],
      demoUrl: "#",
      githubUrl: "#",
      sortOrder: 2
    },
    {
      title: "CloudAPI Gateway",
      description: "A scalable REST API gateway with authentication, rate limiting, caching, and comprehensive API documentation.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      category: "api",
      tags: ["Express.js", "JWT", "Swagger", "Docker"],
      primaryTags: ["Node.js", "Redis"],
      demoUrl: "#",
      githubUrl: "#",
      sortOrder: 3
    },
    {
      title: "DevToolbox",
      description: "A collection of development utilities including code generators, API testing tools, and deployment automation scripts.",
      image: "https://images.unsplash.com/photo-1581447109200-bf2769116351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      category: "tools",
      tags: ["Node.js", "Commander", "Inquirer", "Chalk"],
      primaryTags: ["CLI", "Utility"],
      demoUrl: "#",
      githubUrl: "#",
      sortOrder: 4
    },
    {
      title: "DataViz Pro",
      description: "A comprehensive analytics dashboard with interactive charts, real-time data streaming, and custom visualization components.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      category: "web-app",
      tags: ["React", "Chart.js", "WebSocket", "GraphQL"],
      primaryTags: ["D3.js", "Charts"],
      demoUrl: "#",
      githubUrl: "#",
      sortOrder: 5
    },
    {
      title: "MicroStack",
      description: "A scalable microservices architecture with containerized services, API gateway, and comprehensive monitoring solution.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      category: "api",
      tags: ["Kubernetes", "gRPC", "Prometheus", "Istio"],
      primaryTags: ["Docker", "K8s"],
      demoUrl: "#",
      githubUrl: "#",
      sortOrder: 6
    }
  ];

  for (const project of projectsData) {
    await db.insert(projects).values([project]);
  }

  // Seed tech stack
  const techStackData = [
    // Frontend
    { name: "Next.js", icon: "Next", bg: "bg-black", description: "React Framework", category: "frontend", sortOrder: 1 },
    { name: "React", icon: "fab fa-react", bg: "bg-blue-500", description: "JavaScript Library", category: "frontend", sortOrder: 2 },
    { name: "Tailwind CSS", icon: "TW", bg: "bg-blue-400", description: "Utility-First CSS", category: "frontend", sortOrder: 3 },
    { name: "TypeScript", icon: "TS", bg: "bg-blue-600", description: "Typed JavaScript", category: "frontend", sortOrder: 4 },

    // Backend
    { name: "Node.js", icon: "fab fa-node-js", bg: "bg-green-600", description: "JavaScript Runtime", category: "backend", sortOrder: 1 },
    { name: "Express.js", icon: "Ex", bg: "bg-gray-700", description: "Web Framework", category: "backend", sortOrder: 2 },
    { name: "GraphQL", icon: "GQL", bg: "bg-pink-500", description: "Query Language", category: "backend", sortOrder: 3 },
    { name: "AWS", icon: "fab fa-aws", bg: "bg-orange-500", description: "Cloud Platform", category: "backend", sortOrder: 4 },

    // Database
    { name: "MongoDB", icon: "Mo", bg: "bg-green-500", description: "NoSQL Database", category: "database", sortOrder: 1 },
    { name: "PostgreSQL", icon: "PG", bg: "bg-blue-700", description: "SQL Database", category: "database", sortOrder: 2 },
    { name: "Redis", icon: "Re", bg: "bg-red-600", description: "In-Memory Store", category: "database", sortOrder: 3 },
    { name: "Firebase", icon: "FB", bg: "bg-yellow-500", description: "BaaS Platform", category: "database", sortOrder: 4 },

    // Tools
    { name: "Docker", icon: "fab fa-docker", bg: "bg-blue-600", description: "Containerization", category: "tools", sortOrder: 1 },
    { name: "Git", icon: "fab fa-git-alt", bg: "bg-orange-600", description: "Version Control", category: "tools", sortOrder: 2 },
    { name: "Kubernetes", icon: "K8s", bg: "bg-purple-600", description: "Orchestration", category: "tools", sortOrder: 3 },
    { name: "Vercel", icon: "Ve", bg: "bg-black", description: "Deployment", category: "tools", sortOrder: 4 }
  ];

  for (const tech of techStackData) {
    await db.insert(techStack).values(tech);
  }

  console.log("Data seeded successfully!");
}

seedData()
  .then(() => {
    console.log("Seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });