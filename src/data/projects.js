const projects = [
  {
    id: 1,
    number: "01",
    title: "Kasa",
    description:
      "A responsive property rental application built with reusable React components and dynamic routing.",

    technologies: ["React", "React Router", "SCSS"],

    slug: "kasa",

    github: "https://github.com/Ism6381/Property-rental-app",
    liveUrl: "",

    challenge:
      "The main challenge was to build a complete React application from provided designs while keeping the interface reusable, responsive and easy to maintain.",

    solution:
      "I divided the interface into reusable React components, used React Router to manage navigation and dynamic property pages, and used structured JSON data to generate the property content. I also created responsive layouts for desktop, tablet and mobile devices.",

    skills: [
      "Reusable React components",
      "React Router",
      "Dynamic routing",
      "Working with JSON data",
      "Responsive design",
      "Component-based architecture"
    ]
  },

  {
    id: 2,
    number: "02",
    title: "Sophie Bluel",
    description:
      "A dynamic portfolio website with authentication, filtering and REST API integration.",

    technologies: [
      "JavaScript",
      "REST API",
      "HTML",
      "CSS"
    ],

    slug: "sophie-bluel",

    github: "https://github.com/Ism6381/Sophie-Bluel-website-en2",
    liveUrl: "",

    challenge:
      "The project required transforming a static portfolio into a dynamic application connected to an API, including authentication and an administration interface.",

    solution:
      "I used the Fetch API to retrieve and display projects dynamically, implemented category filtering, created a login system using an authentication token, and built an administration modal that allows projects to be added or deleted.",

    skills: [
      "REST API integration",
      "Fetch API",
      "DOM manipulation",
      "Authentication",
      "Token handling",
      "Dynamic filtering",
      "Modal interfaces"
    ]
},

  {
    id: 3,
    number: "03",
    title: "Nina Carducci",
    description:
      "A photography portfolio optimized for performance, accessibility and search engine visibility.",

    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "SEO",
      "Lighthouse"
    ],

    slug: "nina-carducci",

    github: "https://github.com/Ism6381/Nina-Carducci-Dev",
    liveUrl: "",

    challenge:
      "The existing photography website had performance and SEO issues that affected loading speed, accessibility and search engine optimization.",

    solution:
      "I analyzed the website with Lighthouse, optimized image assets and formats, fixed interface and gallery issues, improved semantic and SEO-related elements, and added structured data to improve how the website can be understood by search engines.",

    skills: [
      "Performance optimization",
      "Lighthouse analysis",
      "Image optimization",
      "SEO",
      "Accessibility",
      "Debugging",
      "Structured data"
    ]
  },
];

export default projects;