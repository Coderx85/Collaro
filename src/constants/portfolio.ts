import { ContactProps, SkillDataProps } from "@/types";
import {
  FaCss3,
  FaEnvelope,
  FaHtml5,
  FaJs,
  FaLinkedin,
  FaLocationArrow,
  FaNodeJs,
  FaPhone,
  FaPython,
  FaReact,
} from "react-icons/fa";
import {
  SiAppwrite,
  SiCplusplus,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiGithubpages,
  SiMongodb,
  SiNextdotjs,
  SiPhp,
  SiSqlite,
  SiStreamlit,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";

export const educationData = {
  title: "education",
  description:
    "I have a B-Tech in Computer Science (2021-25) and Intermediate (2019-21).",
  items: [
    {
      title: "B-Tech Computer Science",
      duration: "2021 - Present",
      institute: "GCET, Greater Noida",
    },
    {
      title: "Intermediate",
      duration: "2019 - 21",
      institute: "Avadh Collegiate, Lucknow",
    },
  ],
};

export const services = [
  {
    num: "01",
    title: "Full Stack Web Development",
    description:
      "Create responsive and user-friendly interfaces, ensuring optimal performance and user experience.",
  },
  {
    num: "02",
    title: "Backend Development and Database Management",
    description:
      "Develop robust backend systems to support your web applications and services.",
  },
  {
    num: "03",
    title: "DevOps Implementation",
    description:
      "I can help you rank your website on the first page of Google.",
  },
  {
    num: "04",
    title: "UI/UX Design",
    description:
      "Lead UI design initiatives to enhance platform usability and user satisfaction.",
  },
];

export const aboutData = {
  title: "About Me",
  description:
    "I have a B-Tech in Computer Science (2021-25) and Intermediate (2019-21).",
  info: [
    {
      fieldName: "Name",
      fieldValue: "Priyanshu",
    },
    {
      fieldName: "Phone",
      fieldValue: "7071915785",
    },
    {
      fieldName: "Email",
      fieldValue: "work.priyanshu085@gmail.com",
    },
    {
      fieldName: "Location",
      fieldValue: "India",
    },
    {
      fieldName: "Languages",
      fieldValue: "English, Hindi",
    },
    {
      fieldName: "Hobbies",
      fieldValue: "Coding, Reading",
    },
    {
      fieldName: "Interests",
      fieldValue: "Data Science, AI",
    },
    {
      fieldName: "Freelance",
      fieldValue: "Available",
    },
  ],
};

export const experienceData = {
  title: "experience",
  description: "I have worked as a web developer at XYZ company for 2 years.",
  items: [
    {
      id: 1,
      title: "Frontend Web Intern",
      company: "JarGoan",
      duration: "05/2024 - 06/2024",
      description:
        "Improved platform usability by 20.6%, increased user engagement by 26.53%, and led UI design initiatives.",
      linkedin: "https://www.linkedin.com/company/jargoan/",
    },
    {
      id: 2,
      title: "AI Intern",
      company: "Tublian",
      duration: "04/2024 - 06/2024",
      description:
        "Enhanced AI proficiency, crafted a chatbot increasing user interaction by 50%, and actively participated in AI sessions.",
      linkedin: "https://www.linkedin.com/company/tublian/",
    },
    {
      id: 3,
      title: "Open Source Contributor",
      company: "Tublian",
      duration: "09/2023 - 11/2023",
      description:
        "Outperformed 91% of users, engaged in AI challenges, and enhanced AI technology proficiency by 30%.",
      linkedin: "https://www.linkedin.com/company/tublian/",
    },
    {
      id: 4,
      title: "Open Source Contributor",
      company: "Hacktoberfest 2023",
      duration: "09/2023 - 10/2023",
      description:
        "Contributed 4 PRs accepted in open source projects, collaborated with global developers, improving community engagement.",
      linkedin: "https://www.linkedin.com/company/hacktoberfest/",
    },
  ],
};

export const skillsData: SkillDataProps = {
  title: "skills",
  description:
    "I am proficient in Python, MERN stack, and front-end technologies.",
  items: [
    {
      section: "Languages",
      techStack: [
        {
          title: "TypeScript",
          icon: SiTypescript,
          level: "Advanced",
        },
        {
          title: "Python",
          icon: FaPython,
          level: "Advanced",
        },
        {
          title: "C++",
          icon: SiCplusplus,
          level: "Intermediate",
        },
        {
          title: "JavaScript",
          icon: FaJs,
          level: "Intermediate",
        },
      ],
    },
    {
      section: "Frontend Dev",
      techStack: [
        {
          title: "Next.js",
          icon: SiNextdotjs,
          level: "Advanced",
        },
        {
          title: "Vite.js",
          icon: SiVite,
          level: "Advanced",
        },
        {
          title: "React.js",
          icon: FaReact,
          level: "Intermediate",
        },
        {
          title: "Html",
          icon: FaHtml5,
          level: "Advanced",
        },
        {
          title: "Css",
          icon: FaCss3,
          level: "Advanced",
        },
      ],
    },
    {
      section: "DevOps & VCS",
      techStack: [
        {
          title: "Docker",
          icon: SiDocker,
          level: "Intermediate",
        },
        {
          title: "Git",
          icon: SiGit,
          level: "Intermediate",
        },
        {
          title: "Vercel",
          icon: SiGithubactions,
          level: "Intermediate",
        },
        {
          title: "Github",
          icon: SiGithub,
          level: "Intermediate",
        },
      ],
    },
    {
      section: "Backend Dev",
      techStack: [
        {
          title: "Node.js",
          icon: FaNodeJs,
          level: "Intermediate",
        },
        {
          title: "Express.js",
          icon: SiExpress,
          level: "Intermediate",
        },
        {
          title: "Php",
          icon: SiPhp,
          level: "Intermediate",
        },
      ],
    },
    {
      section: "Database",
      techStack: [
        {
          title: "MongoDB",
          icon: SiMongodb,
          level: "Intermediate",
        },
        {
          title: "Sql",
          icon: SiSqlite,
          level: "Intermediate",
        },
        {
          title: "Appwrite",
          icon: SiAppwrite,
          level: "Intermediate",
        },
      ],
    },
    {
      section: "Deployment",
      techStack: [
        {
          title: "Streamlit",
          icon: SiStreamlit,
          level: "Intermediate",
        },
        {
          title: "Github Pages",
          icon: SiGithubpages,
          level: "Intermediate",
        },
        {
          title: "Vercel",
          icon: SiVercel,
          level: "Intermediate",
        },
      ],
    },
  ],
};

export const contactInfo: ContactProps[] = [
  {
    title: "Email",
    description: "work.priyanshu085@gmail.com",
    icon: FaEnvelope,
  },
  {
    title: "Phone",
    description: "(+91) 707 191 5785",
    icon: FaPhone,
  },
  {
    title: "Location",
    description: "New Delhi, India",
    icon: FaLocationArrow,
  },
  {
    title: "LinkedIn",
    description: "coderx85",
    icon: FaLinkedin,
  },
];
