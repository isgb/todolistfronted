// Permite activar con teclado (Enter o Espacio) los textos que se editan con clic
export const handleActivationKey = (event, onActivate) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onActivate();
  }
};
