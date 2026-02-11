import React, { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const HeroSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      easing: "ease-in-out",
      once: true, // animate only once
      mirror: false, // do not repeat on scroll up
    });
  }, []);

  return (
    <section className="relative w-full h-[120vh] bg-black text-white flex items-center justify-center">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
        {/* Sub Title */}
        <h1
          className="text-2xl text-white tracking-widest"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Fixing all things cars
        </h1>

        {/* Logo Title */}
        <h1
          className="text-5xl md:text-6xl tracking-widest mt-6"
          data-aos="fade-down"
          data-aos-delay="200"
        >
          Welcome To
        </h1>

        {/* Prestige */}
        <p
          className="text-5xl md:text-6xl text-primary font-bold leading-tight tracking-wide mt-4 mb-6"
          data-aos="fade-up"
          data-aos-delay="300"
        >
                 Tk Automotive
        </p>

        {/* CTA Button */}
        <button
          className="mt-6 bg-primary text-dark cursor-pointer font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 transition group"
          data-aos="zoom-in"
          data-aos-delay="500"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-2">
            GET A QUOTE
          </span>
          <FaArrowRight className="text-dark transition-transform duration-300 group-hover:translate-x-2" />
        </button>

        {/* Badge Row */}
        <div
          className="mt-10 flex flex-wrap justify-center gap-4 text-sm"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <div className="flex items-center gap-2 font-semibold px-3 py-1 rounded">
            <FaArrowRight className="bg-primary text-dark w-5 h-5 p-1 rounded-full" />{" "}
            Fast Service
          </div>
          <div className="flex items-center gap-2 font-semibold px-3 py-1 rounded">
            <FaArrowRight className="bg-primary text-dark w-5 h-5 p-1 rounded-full" />{" "}
            Quality Care
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div
        className="absolute bottom-0 left-0 w-full z-10 border-t bg-black/40 border-gray-700"
        data-aos="fade-up"
        data-aos-delay="700"
      >
        <div className="mx-auto backdrop-blur-sm flex flex-col sm:flex-row items-center justify-center px-6 py-3 gap-2 sm:gap-10 text-white text-sm font-semibold shadow-lg">
          {/* Rating Section */}
          <p className="text-lg">Team<span className="ml-5">5</span></p>
          <p className="uppercase hidden sm:flex">Top Rated</p>
          <div className="flex items-center gap-3 dark:bg-black border mt-5 sm:mt-0 border-gray-600 px-4 py-2 rounded-full order-1 sm:order-2 mb-3 sm:mb-0">
            {/* Stars */}
            <div className="flex text-yellow-400 text-lg">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            {/* Rating Text */}
            <span className="text-white text-sm font-medium">5/5 from</span>
            {/* Reviews Badge */}
            <span className="bg-secondary border border-gray-600 px-3 py-1 rounded-full text-white text-xs font-medium">
              84+ Reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
