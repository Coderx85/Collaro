"use client";
import { contactInfo } from "@/constants";
import ContactForm from "../_components/ContactForm";
const Contact = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-[30px] h-full rounded-2xl">
      <ContactForm />
      <div className="flex flex-1 items-center xl:justify-end order-1 xl:order-none mb-8 xl:mb-0">
        <ul className="flex flex-col gap-10 mr-10">
          {contactInfo.map((info, index) => {
            return (
              <li key={index} className="flex bg-dark-1 items-center gap-6">
                <div className="size-[52px] xl:size-[72px] bg-dark-1 text-primary rounded-md flex items-center justify-center">
                  <div className="text-[28px] text-primary">
                    <info.icon />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white/60">{info.title}</p>
                  <h3 className="text-lg">{info.description}</h3>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Contact;
