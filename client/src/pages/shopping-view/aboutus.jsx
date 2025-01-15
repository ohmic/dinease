import "typeface-roboto";
import GoanChicken from "../../assets/goan-chicken.jpg";
import MalabarChicken from "../../assets/malabar-chicken.jpg";
import GrillChicken from "../../assets/grill-chicken.jpg";
import OrangeChicken from "../../assets/orange.jpg";


const Aboutus = () => {
  return (
    <>
      <div className="mt-16 mb-16 lg:mb-20 grid md:grid-cols-3 items-center justify-center ml-7 mr-7 gap-3 ">
        {/* Container */}

        <img
          src={MalabarChicken}
          className="w-96 h-auto rounded-2xl shadow-2xl shadow-yellow-100"
        />
        <img
          src={GoanChicken}
          className="w-96 h-auto rounded-2xl shadow-2xl shadow-yellow-100"
        />
        <img
          src={GrillChicken}
          className="w-96 h-auto rounded-2xl shadow-2xl shadow-yellow-100"
        />
      </div>

      <div className="flex ml-10 mr-10 justify-center mb-14  text-gray-600 font-semibold text-md lg:text-2xl">
        Introducing Homely Ready to Cook Marinated Chicken - the perfect
        solution for busy weeknights. Our marinated chicken is handcrafted with
        the finest ingredients and seasonings, ensuring a delicious and juicy
        result every time. Super quick as it needs no grinding masala, no
        elaborate cooking - We do the hardwork for you.{" "}
      </div>
      <div className=" p-4  mt-8 w-full mb-20 text-center text-yellow-500 text-xl lg:text-5xl ">
        Experience a burst of flavor in every bite!
      </div>
    </>
  );
};

export default Aboutus;
