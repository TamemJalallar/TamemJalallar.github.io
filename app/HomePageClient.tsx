// app/HomePageClient.tsx
export default function HomePageClient({ data }: Props) {
  if (!data) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Data not loaded</h1>
        <p>siteData import returned null/undefined.</p>
      </div>
    );
  }

  return (
    <>
      <Header logo={data.main.name} />
      <Hero mainData={data.main} />
      <Socials socials={data.socials} />
      <About aboutData={data.about} name={data.main.name} />
      <Skills skillData={data.skills} />
      <Projects projectsData={data.projects} />
      <Experiences experienceData={data.experiences} educationData={data.educations} />
      <Contact />
      <Footer socials={data.socials} name={data.main.name} />
    </>
  );
}
