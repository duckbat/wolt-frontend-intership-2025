import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-10 w-full left-0 bottom-0">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()}</p>
        <p className="text-sm">Khai's Wolt assignment</p>
      </div>
    </footer>
  );
};

export default Footer;
