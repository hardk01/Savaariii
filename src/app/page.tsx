import Hero from "@/components/section/Hero";
import Layout from "@/components/layout/Layout";
import Search1 from "@/components/section/Search";
import Brand1 from "@/components/section/Brand";
import Cta from "@/components/section/Cta";
import WhyUs1 from "@/components/section/WhyUs";
import Cta3 from "@/components/section/Cta1";
import Services from "@/components/section/Services";
import Banners from "@/components/section/Banners";

export default function Home() {
  return (
    <div>
      <Layout headerStyle={1} footerStyle={1}>
        <Hero />
        <Search1 />
        <Brand1 />
        <WhyUs1 />
        <Cta />
        <Services />
        <Cta3 />
        <Banners />
      </Layout>
    </div>
  );
}
