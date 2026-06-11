import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { TournamentAwardsPrediction } from "@/components/awards/TournamentAwardsPrediction";
import { ALL_PLAYERS } from "@/data/squads";

const awardPlayers = ALL_PLAYERS.map((player) => ({
  name: player.name,
  position: player.position,
  country: player.teamName,
}));

export default function AwardsPage() {
  return (
    <>
      <Navbar />
      <main>
        <TournamentAwardsPrediction players={awardPlayers} />
      </main>
      <Footer />
    </>
  );
}