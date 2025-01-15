import map from "../../assets/map.png";
import call from "../../assets/call.png";
import insta from "../../assets/insta.png";
import whatsapp from "../../assets/whatsapp.png";

const Footer = () => {
  return (
    <footer>
      <div
        className="bg-red-900 text-gray-200 py-20"
        style={{
          backgroundImage: `url(${map})`,
          backgroundPositionX: "center",
          backgroundRepeat: "no-repeat", // Avoid repetition
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
          <div className=" flex flex-col items-center">
            {/* Contact Info */}
            <div>
              <h3
                className="text-3xl italic text-white "
                data-aos="zoom-in-down"
                data-aos-easing="ease-in-sine"
                data-aos-duration="5000"
              >
                STAY IN TOUCH
              </h3>
              <p className="mt-4 text-white text-center font-roboto ">
                #202 Tenth cross
                <br />
                Old Mangammanapalya road
                <br />
                <br />
              </p>
              <p className="mt-2 text-white">Phone: +91 7012 889 122</p>
              <p className="mt-2 text-white">Email: dineasefmc@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-yellow-500 py-3 flex flex-col justify-center">
        <div className="flex flex-row gap-4 mx-auto ">
          <a
            href="https://www.dinease.in/tel:+917012889122"
            data-aos="flip-down"
            data-aos-easing="ease-in-sine"
            data-aos-duration="2000"
          >
            <img src={call} alt="Call" />
          </a>
          <a
            href="https://instagram.com/dinease.in"
            data-aos="flip-down"
            data-aos-easing="ease-in-sine"
            data-aos-duration="3000"
          >
            <img src={insta} alt="Instagram" />
          </a>
          <a
            href="https://wa.me/917012889122?text=I%20would%20like%20to%20make%20an%20order."
            data-aos="flip-down"
            data-aos-easing="ease-in-sine"
            data-aos-duration="5000"
          >
            <img src={whatsapp} alt="whatsapp" />
          </a>
        </div>
        <p className="text-center mt-2 font-roboto">dinease © </p>
      </div>
    </footer>
  );
};

export default Footer;
