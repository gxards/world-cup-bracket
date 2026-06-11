import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { StorylinesPrediction } from "@/components/storylines/StorylinesPrediction";

export default function StorylinesPage() {
  return (
    <>
      <Navbar />
      <main>
        <StorylinesPrediction />
      </main>
      <Footer />
    </>
  );
}