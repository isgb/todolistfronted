import React from "react";
import "../../styles/Header.css";
import { IconMenu } from "./IconMenu";
import { ButtonNew } from "./ButtonNew";

export const Header = () => {
  return (
    <header className="app-header">
      <div className="app-header-row">

        {/* Título de la app */}
        <IconMenu />

        {/* Botón Nuevo */}
        <ButtonNew />

      </div>
    </header>
  );
};
