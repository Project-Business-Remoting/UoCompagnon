import { Check } from 'lucide-react';
import './PhaseStepper.css';

const PHASES = [
  "Avant l'arrivee",
  "Semaine d'accueil",
  "Premier mois",
  "Mi-session",
];

const PhaseStepper = ({ currentPhaseIndex = 0, t }) => {
  return (
    <div className="stepper">
      <div className="stepper-track">
        {PHASES.map((_, index) => (
          <div key={index} className="stepper-segment">
            {/* Circle */}
            <div
              className={`stepper-circle ${
                index < currentPhaseIndex
                  ? 'stepper-circle--done'
                  : index === currentPhaseIndex
                  ? 'stepper-circle--current'
                  : 'stepper-circle--future'
              }`}
            >
              {index < currentPhaseIndex ? (
                <Check size={14} strokeWidth={3} />
              ) : index === currentPhaseIndex ? (
                <span className="stepper-dot" />
              ) : null}
            </div>

            {/* Connector line */}
            {index < PHASES.length - 1 && (
              <div
                className={`stepper-line ${
                  index < currentPhaseIndex ? 'stepper-line--done' : ''
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="stepper-labels">
        {PHASES.map((_, index) => {
          const phaseKey = `dashboard.phases.${index + 1}`;
          const label = t ? t(phaseKey) : PHASES[index];
          return (
            <span
              key={index}
              className={`stepper-label ${
                index === currentPhaseIndex ? 'stepper-label--current' : ''
              }`}
            >
              {index + 1}. {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseStepper;
