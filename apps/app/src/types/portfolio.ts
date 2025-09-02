import { IconType } from "react-icons/lib";

export interface SkillDataProps {
  title: string;
  description: string;
  items: {
    section: string;
    techStack: {
      title: string;
      icon: IconType;
      level: string;
    }[];
  }[];
}

export interface ContactProps {
  title: string;
  description: string;
  icon: IconType;
}

export interface ContactLinkProps {
  title: string;
  href: string;
  icon: IconType;
}
