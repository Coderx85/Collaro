import Home from "@/components/icons/Home";
import Personal from "@/components/icons/Personal";
import Previous from "@/components/icons/Previous";
import Reccording from "@/components/icons/Reccording";
import Upcoming from "@/components/icons/Upcoming";
import { FaFolder } from "react-icons/fa";

export const sidebarLinks = [
  {
    route: '',
    label: 'Home',
    details: 'This is the home page',
    component: Home
  },
  {
    route: '/upcoming',
    label: 'Upcoming',
    details: 'List of upcoming meetings',
    component: Upcoming
  },
  {
    route: '/previous',
    label: 'Previous',
    details: 'List of previous meetings',
    component: Previous
  },
  {
    route: '/recordings',
    label: 'Recordings',
    details: 'List of recordings',
    component: Reccording
  },
  {
    route: '/personal-room',
    label: 'Personal Room',
    details: 'User Personal detail',
    component: Personal 
  },
  {
    route: '/workspace-room',
    label: 'Workspace Room',
    details: 'Workspace Room detail',
    component: FaFolder
  }
];

export const avatarImages = [
  '/images/avatar-1.jpeg',
  '/images/avatar-2.jpeg',
  '/images/avatar-3.png',
  '/images/avatar-4.png',
  '/images/avatar-5.png',
];

export const educationData = {
  title: 'education',
  description: 'I have a B-Tech in Computer Science (2021-25) and Intermediate (2019-21).',
  items: [
    {
      title: 'B-Tech Computer Science',
      duration: '2021 - Present',
      institute: 'GCET, Greater Noida'
    },
    {
      title: 'Intermediate',
      duration: '2019 - 21',
      institute: 'Avadh Collegiate, Lucknow'
    }
  ]
}
  
export const services = [
  {
    num: "01",
    title: "Full Stack Web Development",
    description: "Create responsive and user-friendly interfaces, ensuring optimal performance and user experience.",
  },
  {
    num: "02",
    title: "Backend Development and Database Management",
    description: "Develop robust backend systems to support your web applications and services.",
  },
  {
    num: "03",
    title: "DevOps Implementation",
    description: "I can help you rank your website on the first page of Google.",
  },
  {
    num: "04",
    title: "UI/UX Design",
    description: "Lead UI design initiatives to enhance platform usability and user satisfaction.",
  }
]

export const aboutData = {
  title: 'About Me',
  description: 'I have a B-Tech in Computer Science (2021-25) and Intermediate (2019-21).',
  info: [
    {
      fieldName: 'Name',
      fieldValue: 'Priyanshu'
    },
    {
      fieldName: 'Phone',
      fieldValue: '7071915785'
    },
    {
      fieldName: 'Email',
      fieldValue: 'work.priyanshu085@gmail.com'
    },
    {
      fieldName: 'Location',
      fieldValue: 'India'
    },
    {
      fieldName: 'Languages',
      fieldValue: 'English, Hindi'
    },
    {
      fieldName: 'Hobbies',
      fieldValue: 'Coding, Reading'
    },  
    {
      fieldName: 'Interests',
      fieldValue: 'Data Science, AI'
    },
    {
      fieldName: 'Freelance',
      fieldValue: 'Available'
    }
  ]
}

export const experienceData = {
  title: 'experience',
  description: 'I have worked as a web developer at XYZ company for 2 years.',
  items: [
    {
      id: 1,
      title: "Frontend Web Intern",
      company: "JarGoan",
      duration: "05/2024 - 06/2024",
      description: "Improved platform usability by 20.6%, increased user engagement by 26.53%, and led UI design initiatives.",
      linkedin: "https://www.linkedin.com/company/jargoan/",
    },
    {
      id: 2,
      title: "AI Intern",
      company: "Tublian",
      duration: "04/2024 - 06/2024",
      description: "Enhanced AI proficiency, crafted a chatbot increasing user interaction by 50%, and actively participated in AI sessions.",
      linkedin: 'https://www.linkedin.com/company/tublian/'
    },
    {
      id: 3,
      title: "Open Source Contributor",
      company: "Tublian",
      duration: "09/2023 - 11/2023",
      description: "Outperformed 91% of users, engaged in AI challenges, and enhanced AI technology proficiency by 30%.", 
      linkedin: "https://www.linkedin.com/company/tublian/"
    },
    {
      id: 4,
      title: "Open Source Contributor",
      company: "Hacktoberfest 2023",
      duration: "09/2023 - 10/2023",
      description: "Contributed 4 PRs accepted in open source projects, collaborated with global developers, improving community engagement.",
      linkedin: 'https://www.linkedin.com/company/hacktoberfest/'
    }
  ]
}