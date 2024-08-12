import React from "react";
import { IoIosClose } from "react-icons/io";
import Slider from "react-slick";
import { slideAutoPlaySettings } from "../helpers/constants";
import { BsArrow90DegRight } from "react-icons/bs";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

interface CarItemSliderProps {
  items: string[];
  isOpen: boolean;
  toggleModal: Function;
}

const CarItemSlider = ({ isOpen, toggleModal, items }: CarItemSliderProps) => {
  return (
    <>
      <input
        type="checkbox"
        checked={isOpen}
        readOnly
        id="upload-modal"
        className="modal-toggle"
      />
      <div className="modal modal--container carousel w-full">
        <div className="modal-box flex flex-col items-center gap-8">
          <div style={{ width: 800 }} className="carousel w-full">
            <Slider
              nextArrow={
                <FaArrowAltCircleRight fontSize="50px" color="#6E8DAB" />
              }
              prevArrow={<FaArrowAltCircleLeft size="50px" color="#6E8DAB" />}
              className="flex"
              {...slideAutoPlaySettings}
            >
              {items.map((source, idx) => (
                <SlideItem imageSource={source} slideId={`slide${idx + 1}`} />
              ))}
            </Slider>
          </div>
        </div>
        <div className="wrapper z-40">
          <label className="modal-backdrop close-modal" htmlFor="upload-modal">
            <IoIosClose onClick={() => toggleModal()} />
          </label>
        </div>
      </div>
    </>
  );
};

export default CarItemSlider;

interface SlideItemProps {
  imageSource: string;
  slideId: string;
}

const SlideItem = ({ imageSource, slideId }: SlideItemProps) => {
  return (
    <div id={slideId}>
      <img src={imageSource} className="w-full" />
    </div>
  );
};
