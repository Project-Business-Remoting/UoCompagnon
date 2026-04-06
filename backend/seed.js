const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./src/models/User");
const Content = require("./src/models/Content");
const Notification = require("./src/models/Notification");
const connectDB = require("./src/config/db");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Vider la base de données avant d'insérer les données de test
    await User.deleteMany();
    await Content.deleteMany();
    await Notification.deleteMany();

    console.log("Database cleared...");

    // ===== UTILISATEURS =====

    // Étudiant de test (dates ajustées pour être en phase "First Month")
    const now = new Date();
    const arrivalDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // Arrivé il y a 15 jours
    const classStartDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // Cours commencés il y a 10 jours

    await User.create({
      name: "Amara",
      email: "amara@uottawa.ca",
      password: "password123",
      role: "student",
      program: "B.Sc. Computer Science",
      arrivalDate,
      classStartDate,
    });

    // Administrateur de test
    await User.create({
      name: "Admin UO",
      email: "admin@uottawa.ca",
      password: "admin123",
      role: "admin",
      program: "Administration",
      arrivalDate: new Date("2020-01-01"),
      classStartDate: new Date("2020-01-15"),
    });

    console.log("Users created (student + admin)...");

    // ===== CONTENUS — Toutes les phases =====
    await Content.insertMany([
      // --- Before Arrival ---
      {
        title: {
          en: "Finding Accommodations in Ottawa",
          fr: "Trouver un logement à Ottawa",
        },
        description: {
          en: "Comprehensive guide to university residences and off-campus housing. Compare neighborhoods, average prices, and practical tips.",
          fr: "Guide complet sur les résidences universitaires et les logements hors campus. Comparez les quartiers, les prix moyens et les conseils pratiques.",
        },
        articleBody: {
          en: "Securing accommodation is one of the most important steps before arriving in Ottawa. The university offers several on-campus residences which are ideal for first-year students to integrate into campus life. If you prefer off-campus housing, neighborhoods like Sandy Hill, ByWard Market, and Centretown are very popular among students due to their proximity to the campus. When renting off-campus, always ensure you sign a standard Ontario lease and be cautious of scams—never send money before viewing the property or signing a contract.",
          fr: "Trouver un logement est l'une des étapes les plus importantes avant d'arriver à Ottawa. L'université offre plusieurs résidences sur le campus, idéales pour les étudiants de première année souhaitant s'intégrer à la vie universitaire. Si vous préférez un logement hors campus, les quartiers comme Sandy Hill, le marché By et Centreville sont très populaires auprès des étudiants grâce à leur proximité avec le campus. Lors d'une location hors campus, assurez-vous toujours de signer un bail standard de l'Ontario et méfiez-vous des arnaques — n'envoyez jamais d'argent avant d'avoir visité le logement ou signé un contrat.",
        },
        category: "Student Life",
        step: "Before Arrival",
        priority: "High",
        tags: ["housing", "residence", "neighborhoods"],
      },
      {
        title: {
          en: "Preparing Immigration Documents",
          fr: "Préparer ses documents d'immigration",
        },
        description: {
          en: "Checklist of essential documents: study permit, visa, passport, admission letter, proof of financial funds.",
          fr: "Liste de vérification des documents essentiels : permis d'études, visa, passeport, lettre d'admission, preuve de fonds.",
        },
        articleBody: {
          en: "As an international student, having your immigration documents in order is critical. Before you book your flight, ensure your passport is valid for at least six months beyond your intended stay. You must hold a valid Letter of Acceptance from uOttawa, a valid Study Permit (or a letter of introduction from IRCC confirming approval), and optionally a Temporary Resident Visa (TRV) or eTA depending on your country of citizenship. Keep physical copies of these documents in your carry-on luggage, as border agents will ask to see them upon arrival.",
          fr: "En tant qu'étudiant international, il est essentiel que vos documents d'immigration soient en règle. Avant de réserver votre vol, assurez-vous que votre passeport est valide au moins six mois au-delà de votre séjour prévu. Vous devez posséder une lettre d'acceptation valide de l'uOttawa, un permis d'études valide (ou une lettre d'introduction d'IRCC confirmant l'approbation), et éventuellement un visa de résident temporaire (VRT) ou une AVE selon votre pays de citoyenneté. Gardez des copies physiques de ces documents dans votre bagage à main, car les agents frontaliers vous les demanderont à l'arrivée.",
        },
        category: "Administrative",
        step: "Before Arrival",
        priority: "High",
        tags: ["visa", "immigration", "documents"],
      },
      {
        title: {
          en: "Enrolling in Health Insurance (UHIP)",
          fr: "S'inscrire à l'assurance santé (RAÉO)",
        },
        description: {
          en: "The University Health Insurance Plan (UHIP) is mandatory for international students. Here is how to register.",
          fr: "Le Régime d'assurance santé universitaire (RAÉO) est obligatoire pour les étudiants internationaux. Voici comment s'inscrire.",
        },
        articleBody: {
          en: "Healthcare in Canada can be extremely expensive without insurance. That is why uOttawa requires all international students to be enrolled in the University Health Insurance Plan (UHIP). The UHIP coverage provides access to basic medical services, including hospital visits, doctor consultations, and emergency care. Enrollment is usually automatic and the fee is added to your tuition statement, but you must download your coverage card online. Make sure to present this card every time you visit a clinic or hospital.",
          fr: "Les soins de santé au Canada peuvent être extrêmement coûteux sans assurance. C'est pourquoi l'uOttawa exige que tous les étudiants internationaux soient inscrits au Régime d'assurance santé universitaire (RAÉO). La couverture RAÉO donne accès aux services médicaux de base, y compris les visites à l'hôpital, les consultations médicales et les soins d'urgence. L'inscription est généralement automatique et les frais sont ajoutés à votre relevé de droits de scolarité, mais vous devez télécharger votre carte de couverture en ligne. Assurez-vous de présenter cette carte à chaque visite en clinique ou à l'hôpital.",
        },
        category: "Health",
        step: "Before Arrival",
        priority: "Medium",
        tags: ["insurance", "UHIP", "health"],
      },
      {
        title: {
          en: "Preparing Your Budget",
          fr: "Préparer son budget",
        },
        description: {
          en: "Estimating living costs in Ottawa: rent, transportation, groceries, and textbooks. Tips for managing your budget effectively.",
          fr: "Estimation du coût de la vie à Ottawa : loyer, transport, alimentation et manuels scolaires. Conseils pour bien gérer votre budget.",
        },
        articleBody: {
          en: "Living in a new city requires careful financial planning. On average, you should budget between $1,500 and $2,000 CAD per month for living expenses in Ottawa. Rent will vary depending on if you have roommates or live alone, generally costing between $700 and $1,400 CAD per month. Groceries typically cost around $300 to $400 CAD per month. Don't forget to account for a phone plan, winter clothing, and textbooks. Remember, your U-Pass (transit pass) is already included in your tuition fees!",
          fr: "Vivre dans une nouvelle ville nécessite une planification financière rigoureuse. En moyenne, prévoyez entre 1 500 et 2 000 $ CAD par mois pour les dépenses de la vie courante à Ottawa. Le loyer varie selon que vous ayez des colocataires ou viviez seul, coûtant généralement entre 700 et 1 400 $ CAD par mois. L'alimentation coûte environ 300 à 400 $ CAD par mois. N'oubliez pas de prévoir un forfait téléphonique, des vêtements d'hiver et les manuels scolaires. Rappel : votre U-Pass (carte de transport) est déjà incluse dans vos frais de scolarité !",
        },
        category: "Student Life",
        step: "Before Arrival",
        priority: "Medium",
        tags: ["budget", "finances", "cost of living"],
      },

      // --- Welcome Week ---
      {
        title: {
          en: "Activating Your Student Card",
          fr: "Activer votre carte étudiante",
        },
        description: {
          en: "Visit the University Centre to obtain and activate your student card. It serves as your access, library, and transit card.",
          fr: "Rendez-vous au Pavillon universitaire pour obtenir et activer votre carte étudiante. Elle sert de carte d'accès, de bibliothèque et de transport.",
        },
        articleBody: {
          en: "Your uOttawa student card is your passport to the campus. It is used to access university buildings, borrow materials from the library, use the meal plan, and access the campus gym. Furthermore, your student card acts as your U-Pass for relying on Ottawa's public transit network. To get your card, upload your photo online in advance and pick it up at the University Centre (UCU) during Welcome Week. Do not lose it, as replacement fees will apply!",
          fr: "Votre carte étudiante de l'uOttawa est votre passeport pour le campus. Elle sert à accéder aux bâtiments universitaires, emprunter des documents à la bibliothèque, utiliser le plan de repas et accéder au gymnase du campus. De plus, votre carte étudiante fait office de U-Pass pour le réseau de transport en commun d'Ottawa. Pour obtenir votre carte, téléchargez votre photo en ligne à l'avance et récupérez-la au Pavillon universitaire (UCU) pendant la semaine d'accueil. Ne la perdez pas, des frais de remplacement s'appliquent !",
        },
        category: "Administrative",
        step: "Welcome Week",
        priority: "High",
        tags: ["student card", "uOttawa"],
      },
      {
        title: {
          en: "Setting Up uoZone and Brightspace",
          fr: "Configurer uoZone et Brightspace",
        },
        description: {
          en: "Guide to accessing uoZone (administrative portal), Brightspace (online courses), and setting up your university email.",
          fr: "Guide pour accéder à uoZone (portail administratif), Brightspace (cours en ligne) et configurer votre courriel universitaire.",
        },
        articleBody: {
          en: "uoZone and Brightspace are the two most important online portals you will use during your studies. uoZone is the administrative hub where you register for courses, view your schedule, and check your tuition account. Brightspace is the academic platform where professors upload syllabuses, assignments, and grades. Furthermore, ensure you set up your @uottawa.ca email immediately and check it daily, as all official university communications are sent exclusively to this address.",
          fr: "uoZone et Brightspace sont les deux portails en ligne les plus importants que vous utiliserez durant vos études. uoZone est le centre administratif où vous vous inscrivez aux cours, consultez votre horaire et vérifiez votre compte de frais de scolarité. Brightspace est la plateforme académique où les professeurs déposent les plans de cours, les travaux et les notes. De plus, configurez immédiatement votre courriel @uottawa.ca et consultez-le quotidiennement, car toutes les communications officielles de l'université sont envoyées exclusivement à cette adresse.",
        },
        category: "Academic",
        step: "Welcome Week",
        priority: "High",
        tags: ["uoZone", "Brightspace", "email"],
      },
      {
        title: {
          en: "Orientation Events (101 Week)",
          fr: "Événements d'orientation (Semaine 101)",
        },
        description: {
          en: "Calendar for 101 Week events: campus tours, meeting student associations, and the clubs fair.",
          fr: "Calendrier des événements de la Semaine 101 : visites du campus, rencontres avec les associations étudiantes et foire des clubs.",
        },
        articleBody: {
          en: "101 Week is the primary orientation week organized by the student union and faculty associations. It is the perfect opportunity to make friends, explore the campus, and discover Ottawa. Activities include campus scavenger hunts, faculty-specific networking events, and the clubs fair. Even if you are an introvert, participating in a few events can greatly help you ease into university life. Check out your faculty's specific schedule and purchase an orientation kit early, as they sell out fast!",
          fr: "La Semaine 101 est la principale semaine d'orientation organisée par le syndicat étudiant et les associations facultaires. C'est l'occasion idéale de se faire des amis, d'explorer le campus et de découvrir Ottawa. Les activités comprennent des chasses au trésor sur le campus, des événements de réseautage par faculté et la foire des clubs. Même si vous êtes introverti, participer à quelques événements peut grandement faciliter votre intégration à la vie universitaire. Consultez le calendrier spécifique de votre faculté et achetez un kit d'orientation tôt, car ils partent vite !",
        },
        category: "Student Life",
        step: "Welcome Week",
        priority: "Medium",
        tags: ["orientation", "101 week", "clubs"],
      },
      {
        title: {
          en: "Public Transit in Ottawa",
          fr: "Le transport en commun à Ottawa",
        },
        description: {
          en: "The U-Pass is included in your tuition fees. Here is how to use OC Transpo buses and the O-Train to get around.",
          fr: "Le U-Pass est inclus dans vos frais de scolarité. Voici comment utiliser les autobus d'OC Transpo et le O-Train pour vous déplacer.",
        },
        articleBody: {
          en: "Ottawa's public transit system, OC Transpo, consists of buses and the O-Train (Light Rail Transit). Your student U-Pass gives you unlimited access to this network throughout the academic year. The main campus is well-serviced by the O-Train (uOttawa Station and Rideau Station) and numerous bus routes. Download apps like Transit or Google Maps for real-time bus tracking. Remember to always tap your U-Pass on the scanner when boarding a bus or passing through train gates.",
          fr: "Le réseau de transport en commun d'Ottawa, OC Transpo, comprend des autobus et le O-Train (train léger sur rail). Votre U-Pass étudiant vous donne un accès illimité à ce réseau durant toute l'année universitaire. Le campus principal est bien desservi par le O-Train (station uOttawa et station Rideau) et de nombreuses lignes d'autobus. Téléchargez des applications comme Transit ou Google Maps pour suivre les autobus en temps réel. N'oubliez pas de toujours scanner votre U-Pass en montant dans l'autobus ou en passant les portiques du train.",
        },
        category: "Student Life",
        step: "Welcome Week",
        priority: "Low",
        tags: ["transit", "U-Pass", "OC Transpo"],
      },

      // --- First Month ---
      {
        title: {
          en: "Understanding Your Syllabus",
          fr: "Comprendre votre plan de cours",
        },
        description: {
          en: "How to read a syllabus, identify exam dates, grade weightings, and professor expectations.",
          fr: "Comment lire un plan de cours, repérer les dates d'examens, les pondérations et les attentes du professeur.",
        },
        articleBody: {
          en: "A syllabus is essentially a contract between you and your professor. During the first week of classes, thoroughly review the syllabus for each of your courses. Pay close attention to the grading scheme—some courses might heavily weight final exams, while others rely on continuous assessments like essays and midterms. Note down all important deadlines in your personal calendar. Also, check the professor's office hours; attending these hours early in the semester is a great way to introduce yourself and seek help.",
          fr: "Un plan de cours est essentiellement un contrat entre vous et votre professeur. Durant la première semaine de cours, examinez attentivement le plan de cours de chacun de vos cours. Portez une attention particulière à la pondération des notes — certains cours peuvent accorder beaucoup de poids à l'examen final, tandis que d'autres se basent sur des évaluations continues comme les travaux et les examens partiels. Notez toutes les dates importantes dans votre agenda personnel. Consultez également les heures de bureau du professeur ; y assister tôt dans le semestre est un excellent moyen de vous présenter et d'obtenir de l'aide.",
        },
        category: "Academic",
        step: "First Month",
        priority: "High",
        tags: ["syllabus", "courses", "evaluation"],
      },
      {
        title: {
          en: "Health and Wellness Resources",
          fr: "Ressources santé et bien-être",
        },
        description: {
          en: "Services of the campus health clinic, free psychological support, and wellness resources available on campus.",
          fr: "Services de la clinique santé du campus, soutien psychologique gratuit et ressources de bien-être disponibles sur le campus.",
        },
        articleBody: {
          en: "University can be stressful, and prioritizing your health is essential. uOttawa provides a comprehensive health clinic on campus where you can consult doctors and nurses natively. Beyond physical health, the university also provides robust mental health services, including free counseling and 24/7 crisis lines. If you feel overwhelmed, do not hesitate to reach out. Wellness programs also include pet therapy, yoga sessions, and peer support groups operating across the campus.",
          fr: "L'université peut être stressante et il est essentiel de prioriser votre santé. L'uOttawa met à disposition une clinique santé complète sur le campus où vous pouvez consulter des médecins et du personnel infirmier. Au-delà de la santé physique, l'université offre également des services solides en santé mentale, notamment du counseling gratuit et des lignes de crise accessibles 24h/24, 7j/7. Si vous vous sentez débordé, n'hésitez pas à demander de l'aide. Les programmes de bien-être comprennent également la zoothérapie, des séances de yoga et des groupes de soutien entre pairs sur le campus.",
        },
        category: "Health",
        step: "First Month",
        priority: "High",
        tags: ["clinic", "psychologist", "wellness"],
        details: {
          availableServices: [
            "Campus Student Health Clinic",
            "Counseling Services",
            "24/7 Support Line",
          ],
          emergencyContacts: [
            { name: "Campus Security", phone: "613-562-5411" },
            { name: "Crisis Line", phone: "1-866-996-0991" },
          ],
        },
      },
      {
        title: {
          en: "Tutoring and Academic Support",
          fr: "Tutorat et soutien académique",
        },
        description: {
          en: "The Academic Writing Help Centre, peer mentoring, and study skills workshops are available for free.",
          fr: "Le Centre d'aide à la rédaction académique, le mentorat par les pairs et les ateliers de méthodes d'études sont offerts gratuitement.",
        },
        articleBody: {
          en: "No matter your academic level, everyone can benefit from academic support. The Academic Writing Help Centre (AWHC) offers free consultations to help you structure essays, improve grammar, and correctly format citations. Additionally, many faculties run peer mentoring programs where senior students help freshmen understand difficult concepts in challenging subjects (like mathematics or programming). Don't wait until the midterm to seek help—utilize these free resources early in the semester to build a strong foundation.",
          fr: "Quel que soit votre niveau académique, tout le monde peut bénéficier d'un soutien scolaire. Le Centre d'aide à la rédaction académique (CARA) offre des consultations gratuites pour vous aider à structurer vos dissertations, améliorer votre grammaire et formater correctement vos citations. De plus, de nombreuses facultés proposent des programmes de mentorat où les étudiants avancés aident les nouveaux à comprendre les concepts difficiles dans les matières complexes (comme les mathématiques ou la programmation). N'attendez pas les examens partiels pour demander de l'aide — utilisez ces ressources gratuites dès le début du semestre pour bâtir de solides fondations.",
        },
        category: "Academic",
        step: "First Month",
        priority: "Medium",
        tags: ["tutoring", "support", "mentoring"],
      },
      {
        title: {
          en: "Exploring Clubs and Associations",
          fr: "Explorer les clubs et associations",
        },
        description: {
          en: "Over 250 student clubs at uOttawa. Sports, culture, technology, volunteering — find your community.",
          fr: "Plus de 250 clubs étudiants à l'uOttawa. Sports, culture, technologie, bénévolat — trouvez votre communauté.",
        },
        articleBody: {
          en: "University is not just about academics; it's about building a network and developing soft skills. With over 250 registered clubs, you're bound to find a community that shares your passions. From cultural organizations and competitive debate teams to robotics clubs and environmental activism groups, getting involved is a fantastic way to destress and boost your resume. Keep an eye out for Club Fairs happening in the main squares or check the online student portal's club directory.",
          fr: "L'université, ce n'est pas seulement les études ; c'est aussi construire un réseau et développer des compétences interpersonnelles. Avec plus de 250 clubs enregistrés, vous trouverez certainement une communauté qui partage vos passions. Des organisations culturelles aux équipes de débats compétitifs, en passant par les clubs de robotique et les groupes d'activisme environnemental, s'impliquer est un excellent moyen de décompresser et d'enrichir votre CV. Surveillez les foires aux clubs dans les places principales ou consultez le répertoire des clubs sur le portail étudiant en ligne.",
        },
        category: "Student Life",
        step: "First Month",
        priority: "Low",
        tags: ["clubs", "associations", "community"],
      },

      // --- Mid-Term ---
      {
        title: {
          en: "Understanding GPA Calculation",
          fr: "Comprendre le calcul de la MPC",
        },
        description: {
          en: "GPA (Grade Point Average) is calculated on a 10-point scale at uOttawa. Here is how to calculate it and what academic probation means.",
          fr: "La MPC (Moyenne Pondérée Cumulative) est calculée sur une échelle de 10 points à l'uOttawa. Voici comment la calculer et ce que signifie la probation académique.",
        },
        articleBody: {
          en: "uOttawa uses a 10-point grading scale, which can be confusing if you are used to the 4.0 scale or percentage grades. An A+ is worth 10 points, an A is 9 points, and so on. Your CGPA (Cumulative Grade Point Average) is the average of the grade points earned in all your courses. Maintaining a good CGPA is crucial for graduation, scholarships, and co-op eligibility. If your CGPA falls below a certain threshold (usually 4.0 or 5.0 depending on the program), you may be placed on academic probation.",
          fr: "L'uOttawa utilise une échelle de notation sur 10 points, ce qui peut être déroutant si vous êtes habitué à l'échelle 4.0 ou aux pourcentages. Un A+ vaut 10 points, un A vaut 9 points, et ainsi de suite. Votre MPC (Moyenne Pondérée Cumulative) est la moyenne des points de note obtenus dans tous vos cours. Maintenir une bonne MPC est essentiel pour l'obtention du diplôme, les bourses et l'admissibilité au programme coop. Si votre MPC descend sous un certain seuil (généralement 4,0 ou 5,0 selon le programme), vous pourriez être placé en probation académique.",
        },
        category: "Academic",
        step: "Mid-Term",
        priority: "High",
        tags: ["GPA", "grades", "probation"],
      },
      {
        title: {
          en: "Academic Integrity and Plagiarism",
          fr: "Intégrité académique et plagiat",
        },
        description: {
          en: "uOttawa's rules on plagiarism, fraud, and inappropriate collaboration. Consequences and how to avoid mistakes.",
          fr: "Les règles de l'uOttawa sur le plagiat, la fraude et la collaboration inappropriée. Conséquences et comment éviter les erreurs.",
        },
        articleBody: {
          en: "Academic integrity is taken extremely seriously in Canadian universities. Plagiarism includes copying text without citation, submitting someone else's work as your own, and unapproved collaboration on individual assignments. The consequences for academic fraud range from a zero on the assignment to expulsion from the university. Always cite your sources meticulously using the format requested by your professor (APA, MLA, IEEE, etc.). If you are unsure whether an action constitutes plagiarism, ask your professor or consult the writing center.",
          fr: "L'intégrité académique est prise très au sérieux dans les universités canadiennes. Le plagiat inclut la copie de texte sans citation, la soumission du travail d'autrui comme le vôtre et la collaboration non autorisée sur des travaux individuels. Les conséquences de la fraude académique vont du zéro sur le travail jusqu'à l'expulsion de l'université. Citez toujours vos sources méticuleusement en utilisant le format demandé par votre professeur (APA, MLA, IEEE, etc.). Si vous n'êtes pas sûr qu'une action constitue du plagiat, demandez à votre professeur ou consultez le centre de rédaction.",
        },
        category: "Academic",
        step: "Mid-Term",
        priority: "High",
        tags: ["plagiarism", "integrity", "regulations"],
      },
      {
        title: {
          en: "Planning Your Revisions",
          fr: "Planifier vos révisions",
        },
        description: {
          en: "Effective revision techniques: Pomodoro method, flashcards, study groups. Accessing study rooms on campus.",
          fr: "Techniques de révision efficaces : méthode Pomodoro, cartes mémoire, groupes d'étude. Accès aux salles d'étude sur le campus.",
        },
        articleBody: {
          en: "Midterm season can quickly become overwhelming if you do not plan ahead. Start revising at least two weeks before your exams. Break your study sessions into manageable chunks using techniques like the Pomodoro method (25 minutes of studying followed by a 5-minute break). Active recall and formulating flashcards are scientifically proven to be more effective than simply re-reading notes. Also, take advantage of the quiet study rooms in Morisset Library or CRX, which can be booked online through the library portal.",
          fr: "La période des examens partiels peut vite devenir accablante si vous ne planifiez pas à l'avance. Commencez vos révisions au moins deux semaines avant vos examens. Divisez vos sessions d'étude en blocs gérables avec des techniques comme la méthode Pomodoro (25 minutes d'étude suivies de 5 minutes de pause). Le rappel actif et la création de cartes mémoire sont scientifiquement prouvés comme étant plus efficaces que la simple relecture des notes. Profitez également des salles d'étude calmes de la bibliothèque Morisset ou du CRX, réservables en ligne via le portail de la bibliothèque.",
        },
        category: "Academic",
        step: "Mid-Term",
        priority: "Medium",
        tags: ["revision", "exams", "studying"],
      },
      {
        title: {
          en: "Dropping a Course Without Penalty",
          fr: "Abandonner un cours sans pénalité",
        },
        description: {
          en: "Deadline to drop a course without an academic penalty on your transcript. How to evaluate if you should drop a course.",
          fr: "Date limite pour abandonner un cours sans pénalité académique sur votre relevé de notes. Comment évaluer si vous devriez abandonner un cours.",
        },
        articleBody: {
          en: "If you realize that a course is too difficult or overwhelming, you have the option to drop it before a specific deadline without it affecting your GPA. Dropping a course before this deadline means it will not appear on your transcript or it will appear with a 'W' (Withdrawal) instead of a failing grade. Always check the 'Important Dates and Deadlines' page on the university website to know these exact dates. Consult an academic advisor before making a decision, as dropping a course might delay your graduation or affect your full-time student status.",
          fr: "Si vous réalisez qu'un cours est trop difficile ou accablant, vous avez la possibilité de l'abandonner avant une date limite spécifique sans que cela n'affecte votre MPC. Abandonner un cours avant cette date limite signifie qu'il n'apparaîtra pas sur votre relevé de notes ou qu'il apparaîtra avec un « W » (Retrait) au lieu d'une note d'échec. Consultez toujours la page « Dates et échéances importantes » sur le site de l'université pour connaître ces dates exactes. Consultez un conseiller académique avant de prendre une décision, car abandonner un cours pourrait retarder votre diplomation ou affecter votre statut d'étudiant à temps plein.",
        },
        category: "Administrative",
        step: "Mid-Term",
        priority: "Medium",
        tags: ["drop", "courses", "deadline"],
      },
    ]);

    console.log("Contents created (16 contents, 4 per phase)...");

    // ===== NOTIFICATIONS PERSISTANTES =====
    await Notification.insertMany([
      {
        title: {
          en: "Welcome to UO-Compagnon!",
          fr: "Bienvenue sur UO-Compagnon !",
        },
        message: {
          en: "Your companion platform is ready. Explore the contents adapted to your current phase.",
          fr: "Votre plateforme compagnon est prête. Explorez les contenus adaptés à votre phase actuelle.",
        },
        date: new Date().toISOString(),
        type: "success",
        relatedStep: "Before Arrival",
      },
      {
        title: {
          en: "Course Registration Deadline",
          fr: "Date limite d'inscription aux cours",
        },
        message: {
          en: "Don't forget to finalize your course selection before the deadline on uoZone.",
          fr: "N'oubliez pas de finaliser votre choix de cours avant la date limite sur uoZone.",
        },
        date: new Date().toISOString(),
        type: "warning",
        relatedStep: "Welcome Week",
      },
      {
        title: {
          en: "First Assignment Due",
          fr: "Premier travail à remettre",
        },
        message: {
          en: "Check assignment deadlines on Brightspace. Most first assignments are due in the first 2-3 weeks.",
          fr: "Vérifiez les dates de remise des travaux sur Brightspace. La plupart des premiers travaux sont à remettre dans les 2-3 premières semaines.",
        },
        date: new Date().toISOString(),
        type: "info",
        relatedStep: "First Month",
      },
      {
        title: {
          en: "Mid-Term Exams Approaching",
          fr: "Examens de mi-session approchent",
        },
        message: {
          en: "The mid-term exam period is starting soon. Check your exam schedule on uoZone.",
          fr: "La période des examens de mi-session commence bientôt. Vérifiez votre horaire d'examens sur uoZone.",
        },
        date: new Date().toISOString(),
        type: "warning",
        relatedStep: "Mid-Term",
      },
    ]);

    console.log("Notifications created (4 notifications)...");

    console.log("\n Seed complete! Data successfully injected.");
    console.log("   → 2 users (1 student + 1 admin)");
    console.log("   → 16 contents (4 per phase)");
    console.log("   → 4 persistent notifications");
    console.log("\n Test accounts:");
    console.log("   Student : amara@uottawa.ca / password123");
    console.log("   Admin   : admin@uottawa.ca / admin123");

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
