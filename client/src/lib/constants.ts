export const PROJECTS = [
  {
    id: 1,
    title: "NextCommerce",
    description: "A full-featured e-commerce platform built with Next.js, featuring real-time inventory, payment integration, and advanced analytics dashboard.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    category: "web-app",
    tags: ["Next.js", "React", "TypeScript", "Tailwind", "MongoDB", "Stripe"],
    primaryTags: ["Next.js", "Stripe"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 2,
    title: "TaskFlow Pro",
    description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    category: "web-app",
    tags: ["Next.js", "Socket.io", "DnD Kit", "PostgreSQL"],
    primaryTags: ["React", "Firebase"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 3,
    title: "CloudAPI Gateway",
    description: "A scalable REST API gateway with authentication, rate limiting, caching, and comprehensive API documentation.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    category: "api",
    tags: ["Express.js", "JWT", "Swagger", "Docker"],
    primaryTags: ["Node.js", "Redis"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 4,
    title: "DevToolbox",
    description: "A collection of development utilities including code generators, API testing tools, and deployment automation scripts.",
    image: "https://images.unsplash.com/photo-1581447109200-bf2769116351?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    category: "tools",
    tags: ["Node.js", "Commander", "Inquirer", "Chalk"],
    primaryTags: ["CLI", "Utility"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 5,
    title: "DataViz Pro",
    description: "A comprehensive analytics dashboard with interactive charts, real-time data streaming, and custom visualization components.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    category: "web-app",
    tags: ["React", "Chart.js", "WebSocket", "GraphQL"],
    primaryTags: ["D3.js", "Charts"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 6,
    title: "MicroStack",
    description: "A scalable microservices architecture with containerized services, API gateway, and comprehensive monitoring solution.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    category: "api",
    tags: ["Kubernetes", "gRPC", "Prometheus", "Istio"],
    primaryTags: ["Docker", "K8s"],
    demoUrl: "#",
    githubUrl: "#"
  }
];

export const TECH_STACK = {
  frontend: [
    { name: "Next.js", icon: "Next", bg: "bg-black", description: "React Framework" },
    { name: "React", icon: "fab fa-react", bg: "bg-blue-500", description: "JavaScript Library" },
    { name: "Tailwind CSS", icon: "TW", bg: "bg-blue-400", description: "Utility-First CSS" },
    { name: "TypeScript", icon: "TS", bg: "bg-blue-600", description: "Typed JavaScript" }
  ],
  backend: [
    { name: "Node.js", icon: "fab fa-node-js", bg: "bg-green-600", description: "JavaScript Runtime" },
    { name: "Express.js", icon: "Ex", bg: "bg-gray-700", description: "Web Framework" },
    { name: "GraphQL", icon: "GQL", bg: "bg-pink-500", description: "Query Language" },
    { name: "AWS", icon: "fab fa-aws", bg: "bg-orange-500", description: "Cloud Platform" }
  ],
  database: [
    { name: "MongoDB", icon: "Mo", bg: "bg-green-500", description: "NoSQL Database" },
    { name: "PostgreSQL", icon: "PG", bg: "bg-blue-700", description: "SQL Database" },
    { name: "Redis", icon: "Re", bg: "bg-red-600", description: "In-Memory Store" },
    { name: "Firebase", icon: "FB", bg: "bg-yellow-500", description: "BaaS Platform" }
  ],
  tools: [
    { name: "Docker", icon: "fab fa-docker", bg: "bg-blue-600", description: "Containerization" },
    { name: "Git", icon: "fab fa-git-alt", bg: "bg-orange-600", description: "Version Control" },
    { name: "Kubernetes", icon: "K8s", bg: "bg-purple-600", description: "Orchestration" },
    { name: "Vercel", icon: "Ve", bg: "bg-black", description: "Deployment" }
  ]
};

export const SOCIAL_LINKS = [
  { name: "GitHub", icon: "fab fa-github", url: "#", color: "hover:bg-gray-900" },
  { name: "LinkedIn", icon: "fab fa-linkedin", url: "#", color: "hover:bg-blue-600" },
  { name: "Twitter", icon: "fab fa-twitter", url: "#", color: "hover:bg-blue-400" },
  { name: "Email", icon: "fas fa-envelope", url: "mailto:alex.chen@example.com", color: "hover:bg-red-500" }
];

export const CONTACT_INFO = {
  email: "alex.chen@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA"
};
