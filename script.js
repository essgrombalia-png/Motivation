const messages = [
  'Du gör skillnad – en bra dag börjar med dig.',
  'Din insats betyder mer än du tror. Tack för att du är här.',
  'Idag har du möjlighet att göra något riktigt bra.',
  'Ta ett andetag, le och kör – du har det här.',
  'Små insatser skapar stora resultat. Ditt arbete räknas.',
  'Du behöver inte vara perfekt – gör ditt bästa och var stolt.',
  'Din energi smittar. Sprid något positivt idag.',
  'Tillsammans gör vi Sigtuna ännu bättre.',
  'Du är en viktig del av laget. Vi behöver din kraft idag.',
  'En ny dag, en ny möjlighet att skapa något bra.'
];

const labels = ['DU KAN','BRA JOBBAT','DIN DAG','ENERGI','DU GÖR SKILLNAD','TILLSAMMANS','KÖR','HEJA DIG'];
const wheel = document.querySelector('#wheel');
const button = document.querySelector('#spinButton');
const message = document.querySelector('#message');
const status = document.querySelector('#status');
const counter = document.querySelector('#counter');
const today = document.querySelector('#today');
const labelHost = document.querySelector('#wheelLabels');
let spinning = false;
let rotation = 0;
let shown = 1;

const now = new Date();
today.textContent = new Intl.DateTimeFormat('sv-SE', {day:'numeric', month:'short', year:'numeric'}).format(now);

labels.forEach((text, i) => {
  const el = document.createElement('span');
  el.className = `segment-label ${i % 2 === 1 ? 'dark' : ''}`;
  const angle = i * 45 + 22.5;
  el.style.transform = `rotate(${angle}deg) translateY(-165px) rotate(${-angle}deg)`;
  el.textContent = text;
  labelHost.appendChild(el);
});

function pickMessage() {
  const previous = message.textContent;
  let next = messages[Math.floor(Math.random() * messages.length)];
  if (messages.length > 1) {
    while (next === previous) next = messages[Math.floor(Math.random() * messages.length)];
  }
  return next;
}

function spin() {
  if (spinning) return;
  spinning = true;
  button.disabled = true;
  wheel.setAttribute('aria-disabled', 'true');
  status.textContent = 'Hjulet snurrar…';
  const extra = 1440 + Math.floor(Math.random() * 1080);
  rotation += extra;
  wheel.style.transform = `rotate(${rotation}deg)`;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(() => {
    message.textContent = pickMessage();
    shown = (shown % 99) + 1;
    counter.textContent = String(shown).padStart(2, '0');
    status.textContent = 'Dagens energi är vald. Ha en fin arbetsdag!';
    spinning = false;
    button.disabled = false;
    wheel.removeAttribute('aria-disabled');
    message.focus?.();
  }, reduced ? 50 : 4900);
}

button.addEventListener('click', spin);
wheel.addEventListener('click', spin);
wheel.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    spin();
  }
});
