import React from "react";
import '../../styles/taskcontainer.css';
import '../../styles/taksheader.css'

export const TaskContainer = () => {
  return (
    <section className="task-container">

      <header className="task-header">

        <div>
            <div>Menu</div>
            <h3>TASKLIST</h3>            
        </div>

        <button>+</button>

      </header>

    </section>
  );
};
