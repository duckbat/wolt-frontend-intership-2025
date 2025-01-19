import React, { useRef } from "react";
import Title from "./components/ui/Title";
import Calculator from "./components/Calculator";
import Footer from "./components/ui/Footer";
import SushiLottie, { SushiLottieRef } from "./components/ui/SushiLottie";

// Custom hook for animation handling
const useSushiLottie = () => {
  const sushiRef = useRef<SushiLottieRef | null>(null);

  const handlePlayAnimation = () => {
    sushiRef.current?.playAnimation();
  };

  return { sushiRef, handlePlayAnimation };
};

const App: React.FC = () => {
  const { sushiRef, handlePlayAnimation } = useSushiLottie();

  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="flex-grow">
        <Title />
        <Calculator onPlayAnimation={handlePlayAnimation} />
      </div>
      <Footer />
      <SushiLottie ref={sushiRef} />
    </div>
  );
};

export default App;
