import React from "react";
import map from "../../assets/world.png";
import call from "../../assets/telephone.png";
import insta from "../../assets/insta.png";
import whatsapp from "../../assets/social.png";

const FooterNew = () => {
  return (
    <div className="bg-black text-gray-200 px-2">
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
          <div className=" flex flex-col items-center">
            {/* Contact Info */}
            <div>
              <h3
                className="text-xl sm:text-2xl text-transparent md:text-3xl lg:text-5xl font-bold bg-clip-text text-center bg-gradient-to-r from-[#b92b27] to-[#1565c0]  animate-textShine "
                style={{ backgroundSize: "200%" }}
                // data-aos="zoom-in-down"
                // data-aos-easing="ease-in-sine"
                // data-aos-duration="5000"
              >
                STAY IN TOUCH
              </h3>
              <p className="mt-4 text-center font-roboto text-xs md:text-md lg:text-lg">
                #202 Tenth cross
                <br />
                Old Mangammanapalya road
                <br />
                <br />
              </p>
              <p className="mt-2 text-xs md:text-md lg:text-lg">
                Phone: +91 7012 889 122
              </p>
              <p className="mt-2 text-xs md:text-md lg:text-lg">
                Email: dineasefmc@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className=" py-3 flex flex-col-reverse gap-2 md:grid grid-cols-2 justify-between items-center">
        <p className="text-lime-200 text-sm md:text-md">Dinease ©</p>
        <div className="flex flex-row-2 gap-4 md:ms-auto ">
          <a href="https://www.dinease.in/tel:+917012889122">
            <img src={call} className="w-7 md:w-10" alt="Call" />
          </a>
          <a href="https://instagram.com/dinease.in">
            <img src={insta} className="w-7 md:w-10" alt="Instagram" />
          </a>
          <a href="https://wa.me/917012889122?text=I%20would%20like%20to%20make%20an%20order.">
            <img src={whatsapp} className="w-7 md:w-10" alt="whatsapp" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterNew;
