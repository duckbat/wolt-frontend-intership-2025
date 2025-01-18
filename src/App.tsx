import React, { useRef } from "react";
import Title from "./components/ui/Title";
import Calculator from "./components/Calculator";
import Footer from "./components/ui/Footer";
import SushiLottie, { SushiLottieRef } from "./components/ui/SushiLottie";

const App: React.FC = () => {
  // We'll store a ref to SushiLottie
  const sushiRef = useRef<SushiLottieRef | null>(null);

  // A method the child (Calculator) can call to replay the Lottie
  const handlePlayAnimation = () => {
    sushiRef.current?.playAnimation();
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="flex-grow">
        <Title />
        {/*
          Pass handlePlayAnimation down to <Calculator />
          so it can trigger the Lottie anytime
        */}
        <Calculator onPlayAnimation={handlePlayAnimation} />
      </div>
      <Footer />

      {/* The single Lottie pinned bottom-right, with a ref */}
      <SushiLottie ref={sushiRef} />
    </div>
  );
};

export default App;
