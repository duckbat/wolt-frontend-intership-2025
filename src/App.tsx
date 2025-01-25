import React from "react";
import Title from "./components/ui/Title";
import Calculator from "./components/Calculator";
import Footer from "./components/ui/Footer";
import SushiLottie from "./components/ui/SushiLottie";
import useSushiLottie from "./hooks/useSushiLottie";

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
