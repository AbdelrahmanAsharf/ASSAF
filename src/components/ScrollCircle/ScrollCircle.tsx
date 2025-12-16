"use client";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ScrollCircleProps {
  dir: "rtl" | "ltr";
}

export default function ScrollCircle({ dir }: ScrollCircleProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      const progressValue = (scrollTop / height) * 100;
      setProgress(progressValue);

      setVisible(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  const positionClass = dir === "rtl" ? "left-6" : "right-6";

  return (
    <div
      onClick={scrollToTop}
      className={`fixed bottom-6 ${positionClass} z-50 cursor-pointer group`}
    >
    
      <div
        className="relative w-[50px] h-[50px] rounded-full transition-all duration-300"
        style={{
          background: `conic-gradient(
            #000000 ${progress * 3.6}deg,
            #e5e7eb ${progress * 3.6}deg
          )`,
        }}
      >
      
        <div className="absolute inset-[3px] rounded-full bg-white"></div>
        
        
        <div className="absolute inset-[5px] rounded-full bg-gray-100"></div>

    
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white group-hover:bg-black rounded-full p-3 transition-all duration-200 shadow-lg group-hover:scale-110">
            <ArrowUp className="w-5 h-5 text-black group-hover:text-white transition-colors duration-200" />
          </div>
        </div>
      </div>
    </div>
  );
}