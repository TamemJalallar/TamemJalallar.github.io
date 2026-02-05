"use client";

import Image from "next/image";
import Link from "next/link";
import SectionWrapper from "./SectionWrapper";
import { BiLinkExternal } from "react-icons/bi";
import { about } from "@/types/main";

interface Props {
  aboutData?: about;
  name: string;
}

const About = ({ aboutData, name }: Props) => {
  if (!aboutData) return null;

  const {
    aboutImage,
    aboutImageCaption,
    title,
    about,
    resumeUrl,
    callUrl,
  } = aboutData;

  return (
    <SectionWrapper
      id="about"
      className="min-h-[90vh] pt-12 bg-gradient-to-b from-white to-gray-100/20 dark:from-grey-900 dark:to-grey-900"
    >
      <h2 className="text-4xl text-center">About Me</h2>

      <div className="w-full lg:w-11/12 2xl:w-4/5 mt-2 lg:mt-20 mx-auto flex flex-col md:gap-4 lg:flex-row justify-between items-center">
        {aboutImage ? (
          <div className="p-3 w-56 md:w-2/5 lg:w-72 bg-white dark:bg-grey-800 flex flex-col gap-2 items-center rounded-2xl mx-auto lg:mx-16">
            <Image
              alt="profile"
              width={1000}
              height={1000}
              className="w-full h-60 md:h-80 rounded-2xl object-cover"
              src={aboutImage}
            />
            <span className="font-medium font-sans">
              {aboutImageCaption ??
                "< Novice in Web Design, Expert in Web Services />"}
            </span>
          </div>
        ) : null}

        <div className="flex-1 text-left mx-4 md:p-6">
          <p className="text-3xl font-semibold">{name}</p>
          {title ? (
            <p className="text-violet-800 w-fit rounded py-1 px-2 text-sm bg-violet-50 dark:bg-violet-900/10">
              {title}
            </p>
          ) : null}

          {about ? (
            <p className="text-sm md:text-base my-2 text-gray-600 dark:text-gray-300">
              {about}
            </p>
          ) : null}

          <div className="flex items-center gap-4 mt-4">
            {resumeUrl?.trim() && (
              <Link
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-violet-600 text-white rounded-md py-2 px-6"
              >
                Resume
              </Link>
            )}

            {callUrl?.trim() && (
              <Link
                href={callUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 flex items-center gap-1"
              >
                Book a 1:1 call <BiLinkExternal />
              </Link>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;