import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import getUser from "@/lib/getUser";

// Force dynamic rendering for this page since it uses cookies
export const dynamic = 'force-dynamic';


export default async function Home() {
  const user = await getUser();

  return <div>
    <Header user={user} />
    <Hero />
    <Features />
    <Footer />
  </div>

}
