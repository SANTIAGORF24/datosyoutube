import React from "react";
import { Divider } from "@nextui-org/react";

const ContactInfo = ({ icon, text }) => (
  <div className="space-y-1 flex items-center">
    <img className="phoneimg" src={icon} alt="Icono de contacto" />
    <p className="text-small px-3">{text}</p>
  </div>
);

const SocialMediaIcon = ({ icon }) => (
  <div>
    <img className="phoneimg" src={icon} alt="Icono de red social" />
  </div>
);

const NewContactBanner = () => {
  return (
    <div className="px-3 sm:flex items-center justify-center max-w-full pb-10">
      <div className="sm:flex items-center justify-between w-4/5">
        <div>
          <p>Inovamos en cada</p>
          <h4 className="font-bold text-xl">Línea de código</h4>
          <p>Soportamos en cada desafio</p>
        </div>
        <div className="py-3 sm:flex justify-between items-center sm:w-3/6 ">
          <div>
            <div className="max-w-md ">
              <ContactInfo
                icon={"assets/img/Contact/phone.jpg"}
                text={"+57 3154852832"}
              />
              <Divider className="my-4 " />
              <ContactInfo
                icon={"assets/img/Contact/mail.jpg"}
                text={"sibartech@gmail.com"}
              />
            </div>
          </div>
          <div>
            <div className="max-w-md max-sm:py-5">
              <div className="space-y-1">
                <h4 className="text-lg font-medium">Social Media</h4>
                <p className="text-sm ">
                  No dudes en segirnos en nuestras redes
                </p>
              </div>
              <Divider className="my-4" />
              <div className="flex h-5 items-center space-x-4 text-small max-sm:space-x-9">
                <SocialMediaIcon icon={"assets/img/Contact/facebook.jpg"} />
                <Divider orientation="vertical" />
                <SocialMediaIcon icon={"assets/img/Contact/linked.jpg"} />
                <Divider orientation="vertical" />
                <SocialMediaIcon icon={"assets/img/Contact/twitter.jpg"} />
                <Divider orientation="vertical" />
                <SocialMediaIcon icon={"assets/img/Contact/instagram.jpg"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewContactBanner;
