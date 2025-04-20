import React from "react";
import "../../styles/header.css";
import { IconMenu } from "./IconMenu";
import { ButtonNew } from "./ButtonNew";

export const Header = () => {
  return (
    <header className="container">
      <div className="row justify-content-between">
        
        {/* Icono Menú y título */}
        <IconMenu />

        {/* Botón Nuevo */}
        <ButtonNew />

      </div>
    </header>
  );
};
