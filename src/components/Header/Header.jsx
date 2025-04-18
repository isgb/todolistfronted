import React from "react";
import "../../styles/header.css";

export const Header = () => {
  return (
    <header className="container">
      <div className="row justify-content-between">
        <div className="col-auto d-flex align-items-center container-menu-and-title">
          <p className="mb-0">Menú</p>
          <h3 className="mb-0">Task List</h3>
        </div>

        <div className="col-auto container-button">
          <button class="btn btn-outline-light fw-bold px-4 py-2 rounded-pill">
            + New
          </button>
        </div>
      </div>
    </header>
  );
};
