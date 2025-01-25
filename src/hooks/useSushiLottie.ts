import { useRef } from "react";
import { SushiLottieRef } from "../components/ui/SushiLottie";

// Custom hook for lottie animation handling
const useSushiLottie = () => {
  const sushiRef = useRef<SushiLottieRef | null>(null);

  const handlePlayAnimation = () => {
    sushiRef.current?.playAnimation();
  };

  return { sushiRef, handlePlayAnimation };
};

export default useSushiLottie;
