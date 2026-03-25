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

  if (now < arrival) return "Avant l'arrivée";

  // Si on est arrivé mais que les cours n'ont pas commencé
  if (now >= arrival && now < classes) return "Semaine d'accueil";

  // Si les cours ont commencé depuis moins d'un mois
  if (diffFromClasses >= 0 && diffFromClasses <= 30) return "Premier mois";

  // Au-delà de 30 jours après la rentrée
  return "Mi-session";
};

module.exports = { PROGRAMS, calculateCurrentStep };
