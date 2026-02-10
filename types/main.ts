type skill = {
    name: string;
    image: string;
    category: string;
  };
  
  type project = {
    name: string;
    image: string;
    techstack: string;
    category: string;
    links: {
      visit?: string;
      code?: string;
      video?: string;
    };
  };
  
  type experience = {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    desc: string[];
    logo?: string;
  };
  
  type education = {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
    logo?: string;
  };
  
  type main = {
    name: string;
    titles?: string[];
    heroImage?: string;
    shortDesc?: string;
    techStackImages?: string[];
  };
  
  type about = {
    aboutImage?: string;
    aboutImageCaption?: string;
    title?: string;
    about?: string;
    resumeUrl?: string;
    callUrl?: string;
  };

  type assistantFaq = {
    question: string;
    answer: string;
    tags?: string[];
  };

  type assistant = {
    title?: string;
    subtitle?: string;
    faqs: assistantFaq[];
  };
  
  type social = {
    name: string;
    icon: string;
    link: string;
  };
  
  type data = {
    main: main;
    about?: about;
    skills?: skill[];
    projects?: project[];
    experiences?: experience[];
    educations?: education[];
    socials?: social[];
    assistant?: assistant;
  };
  
  export type {
    data,
    main,
    about,
    skill,
    project,
    experience,
    education,
    social,
    assistant,
    assistantFaq,
  };
