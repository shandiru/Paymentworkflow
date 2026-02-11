import React, { useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration (ms)
      easing: 'ease-in-out',
      once: true, // Only animate once
    });
  }, []);

const testimonials = [
  {
    text: "Remap made the car considerably more powerful throughout the rev range without sacrificing any efficiency. Tristan was very flexible with times and managed to get the exact date and time I needed. Very good for fitting aftermarket parts and advice. 10/10 will definitely come back soon!",
    name: "Matthew Lewis",
    
  }
];


  return (
    <section 
      className="dark:bg-black bg-white px-4 sm:px-6 lg:px-12 xl:px-20 py-16 md:py-24 transition-colors"
      data-aos="fade-up"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 mt-20 items-center">
        
        {/* Left Text Side */}
        <div data-aos="fade-right">
          <p className="text-lg uppercase text-gray-800 dark:text-white tracking-widest mb-2">
            / About
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold  tracking-wide text-primary mb-4 uppercase leading-snug">
            Dedicated <br />to Perfection
          </h2>

          <p className="text-black dark:text-white text-sm mb-6 max-w-md">
            Experience top-notch service and unmatched <br /> expertise in every repair.
          </p>

          {/* Badge Row */}
          <div className="flex flex-wrap items-center gap-4 mb-8" data-aos="zoom-in" data-aos-delay="200">
            <div className="flex items-center gap-2 text-sm font-semibold dark:text-white text-black">
              <FaArrowRight className="bg-rating text-black dark:text-white rounded-sm p-1 w-5 h-5" />
              Reliable Work
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold dark:text-white text-black">
              <FaArrowRight className="bg-rating text-black dark:text-white rounded-sm p-1 w-5 h-5" />
              Trusted Technicians
            </div>
          </div>

          {/* Learn More Button */}
          <button
            className="dark:bg-white bg-black text-black group dark:text-white font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:opacity-90 transition"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <FaArrowRight className="text-primary transition-transform duration-300 group-hover:-translate-x-2" />
            <span className="text-white dark:text-black transition-transform duration-300 group-hover:translate-x-2">LEARN MORE</span>
          </button>

          {/* Testimonial */}
       <div className="mt-10 space-y-6" data-aos="fade-up" data-aos-delay="400">
            {testimonials.map((t, index) => (
              <div key={index} className="flex items-center gap-4">
                <div>
                  <p className="italic text-sm text-gray-700 dark:text-gray-300 mb-1">
                    "{t.text}"
                  </p>
                  <p className="text-black dark:text-white font-medium text-sm">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image Side */}
        <div className="relative" data-aos="fade-left">
          <div className="relative z-10 rounded-lg shadow-lg">
            <img
              src="/image.png"
              alt="Spray Work"
              className="w-full object-cover h-150 rounded-sm"
            />

            {/* Right full border */}
            <div className="absolute top-0 right-0 h-full w-[15px] bg-gradient-to-b from-transparent to-[var(--color-rating)]"></div>

            {/* Bottom fixed half-border */}
            <div className="absolute bottom-0 left-0 w-full h-[15px] bg-gradient-to-r from-transparent to-[var(--color-rating)]"></div>
           <img
            src="/image.png"
            alt="Detail work"
            className="absolute bottom-5 -left-5 w-32 md:w-30 h-30 z-20"
          />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
