import React from "react";
import Title from "./components/ui/Title";
import Calculator from "./components/Calculator";
import Footer from "./components/ui/Footer";
const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Title />
        <Calculator />
      </div>

      <Footer />
    </div>
  );
};

export default App;
