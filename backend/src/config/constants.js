const PROGRAMS = [
  "B.Sc. Computer Science",
  "B.Sc. Software Engineering",
  "B.Com. Finance",
  "B.A. Communication",
  "M.Eng. Digital Transformation",
];

const calculateCurrentStep = (arrivalDate, classStartDate) => {
  const now = new Date();
  const arrival = new Date(arrivalDate);
  const classes = new Date(classStartDate);

  // Calcul de la différence en jours par rapport au début des cours
  const diffFromClasses = Math.floor((now - classes) / (1000 * 60 * 60 * 24));

  if (now < arrival) return "Before Arrival";

  // Si on est arrivé mais que les cours n'ont pas commencé
  if (now >= arrival && now < classes) return "Welcome Week";

  // Si les cours ont commencé depuis moins d'un mois
  if (diffFromClasses >= 0 && diffFromClasses <= 30) return "First Month";

  // Au-delà de 30 jours après la rentrée
  return "Mid-Term";
};

module.exports = { PROGRAMS, calculateCurrentStep };
