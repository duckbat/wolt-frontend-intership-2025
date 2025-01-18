import { forwardRef, useImperativeHandle, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import sushiJump from "../../assets/lottie/sushi-jump.json";

// We'll expose a method called playAnimation() so the parent can trigger it.
export interface SushiLottieRef {
  playAnimation: () => void;
}

const SushiLottie = forwardRef<SushiLottieRef>((_props, ref) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useImperativeHandle(ref, () => ({
    playAnimation() {
      if (lottieRef.current) {
        // Jump to frame 0 and play from start
        lottieRef.current.goToAndPlay(0, true);
      }
    },
  }));

  return (
    <div
      className="
        absolute bottom-0 right-0
        w-[125px] h-[200px]
        sm:w-[225px] sm:h-[225px]
        lg:w-[325px] lg:h-[325px]
        z-50
      "
    >
      <Lottie
        loop={false} // Plays only once, then stops
        autoplay={true} // Plays automatically on page load
        lottieRef={lottieRef}
        animationData={sushiJump}
      />
    </div>
  );
});

SushiLottie.displayName = "SushiLottie";
export default SushiLottie;
