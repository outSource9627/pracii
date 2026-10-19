import { Nav } from "@/components/nav";
import { Abilities } from "@/components/sections/abilities";
import { Day } from "@/components/sections/day";
import { Film } from "@/components/sections/film";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Idea } from "@/components/sections/idea";
import { Join } from "@/components/sections/join";
import { Language } from "@/components/sections/language";
import { Memory } from "@/components/sections/memory";
import { Physical } from "@/components/sections/physical";
import { Privacy } from "@/components/sections/privacy";
import { Story } from "@/components/sections/story";
import { Today } from "@/components/sections/today";
import { Vision } from "@/components/sections/vision";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Film />
        <Idea />
        <Day />
        <Abilities />
        <Memory />
        <Language />
        <Physical />
        <Story />
        <Today />
        <Privacy />
        <Vision />
        <Join />
      </main>
      <Footer />
    </>
  );
}
