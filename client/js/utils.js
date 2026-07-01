const ALERGENOS_LABEL = {
  gluten: "Gluten",
  lacteos: "Lácteos",
  huevo: "Huevo",
  pescado: "Pescado",
  crustaceos: "Crustáceos",
  moluscos: "Moluscos",
  sulfitos: "Sulfitos",
};

const formatoPrecio = (n) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

export { ALERGENOS_LABEL, formatoPrecio };
