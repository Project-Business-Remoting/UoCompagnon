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
        title: "Finding Accommodations in Ottawa",
        description: "Comprehensive guide to university residences and off-campus housing. Compare neighborhoods, average prices, and practical tips.",
        articleBody: "Securing accommodation is one of the most important steps before arriving in Ottawa. The university offers several on-campus residences which are ideal for first-year students to integrate into campus life. If you prefer off-campus housing, neighborhoods like Sandy Hill, ByWard Market, and Centretown are very popular among students due to their proximity to the campus. When renting off-campus, always ensure you sign a standard Ontario lease and be cautious of scams—never send money before viewing the property or signing a contract.",
        category: "Student Life",
        step: "Before Arrival",
        priority: "High",
        tags: ["housing", "residence", "neighborhoods"],
      },
      {
        title: "Preparing Immigration Documents",
        description: "Checklist of essential documents: study permit, visa, passport, admission letter, proof of financial funds.",
        articleBody: "As an international student, having your immigration documents in order is critical. Before you book your flight, ensure your passport is valid for at least six months beyond your intended stay. You must hold a valid Letter of Acceptance from uOttawa, a valid Study Permit (or a letter of introduction from IRCC confirming approval), and optionally a Temporary Resident Visa (TRV) or eTA depending on your country of citizenship. Keep physical copies of these documents in your carry-on luggage, as border agents will ask to see them upon arrival.",
        category: "Administrative",
        step: "Before Arrival",
        priority: "High",
        tags: ["visa", "immigration", "documents"],
      },
      {
        title: "Enrolling in Health Insurance (UHIP)",
        description: "The University Health Insurance Plan (UHIP) is mandatory for international students. Here is how to register.",
        articleBody: "Healthcare in Canada can be extremely expensive without insurance. That is why uOttawa requires all international students to be enrolled in the University Health Insurance Plan (UHIP). The UHIP coverage provides access to basic medical services, including hospital visits, doctor consultations, and emergency care. Enrollment is usually automatic and the fee is added to your tuition statement, but you must download your coverage card online. Make sure to present this card every time you visit a clinic or hospital.",
        category: "Health",
        step: "Before Arrival",
        priority: "Medium",
        tags: ["insurance", "UHIP", "health"],
      },
      {
        title: "Preparing Your Budget",
        description: "Estimating living costs in Ottawa: rent, transportation, groceries, and textbooks. Tips for managing your budget effectively.",
        articleBody: "Living in a new city requires careful financial planning. On average, you should budget between $1,500 and $2,000 CAD per month for living expenses in Ottawa. Rent will vary depending on if you have roommates or live alone, generally costing between $700 and $1,400 CAD per month. Groceries typically cost around $300 to $400 CAD per month. Don't forget to account for a phone plan, winter clothing, and textbooks. Remember, your U-Pass (transit pass) is already included in your tuition fees!",
        category: "Student Life",
        step: "Before Arrival",
        priority: "Medium",
        tags: ["budget", "finances", "cost of living"],
      },

      // --- Welcome Week ---
      {
        title: "Activating Your Student Card",
        description: "Visit the University Centre to obtain and activate your student card. It serves as your access, library, and transit card.",
        articleBody: "Your uOttawa student card is your passport to the campus. It is used to access university buildings, borrow materials from the library, use the meal plan, and access the campus gym. Furthermore, your student card acts as your U-Pass for relying on Ottawa's public transit network. To get your card, upload your photo online in advance and pick it up at the University Centre (UCU) during Welcome Week. Do not lose it, as replacement fees will apply!",
        category: "Administrative",
        step: "Welcome Week",
        priority: "High",
        tags: ["student card", "uOttawa"],
      },
      {
        title: "Setting Up uoZone and Brightspace",
        description: "Guide to accessing uoZone (administrative portal), Brightspace (online courses), and setting up your university email.",
        articleBody: "uoZone and Brightspace are the two most important online portals you will use during your studies. uoZone is the administrative hub where you register for courses, view your schedule, and check your tuition account. Brightspace is the academic platform where professors upload syllabuses, assignments, and grades. Furthermore, ensure you set up your @uottawa.ca email immediately and check it daily, as all official university communications are sent exclusively to this address.",
        category: "Academic",
        step: "Welcome Week",
        priority: "High",
        tags: ["uoZone", "Brightspace", "email"],
      },
      {
        title: "Orientation Events (101 Week)",
        description: "Calendar for 101 Week events: campus tours, meeting student associations, and the clubs fair.",
        articleBody: "101 Week is the primary orientation week organized by the student union and faculty associations. It is the perfect opportunity to make friends, explore the campus, and discover Ottawa. Activities include campus scavenger hunts, faculty-specific networking events, and the clubs fair. Even if you are an introvert, participating in a few events can greatly help you ease into university life. Check out your faculty’s specific schedule and purchase an orientation kit early, as they sell out fast!",
        category: "Student Life",
        step: "Welcome Week",
        priority: "Medium",
        tags: ["orientation", "101 week", "clubs"],
      },
      {
        title: "Public Transit in Ottawa",
        description: "The U-Pass is included in your tuition fees. Here is how to use OC Transpo buses and the O-Train to get around.",
        articleBody: "Ottawa's public transit system, OC Transpo, consists of buses and the O-Train (Light Rail Transit). Your student U-Pass gives you unlimited access to this network throughout the academic year. The main campus is well-serviced by the O-Train (uOttawa Station and Rideau Station) and numerous bus routes. Download apps like Transit or Google Maps for real-time bus tracking. Remember to always tap your U-Pass on the scanner when boarding a bus or passing through train gates.",
        category: "Student Life",
        step: "Welcome Week",
        priority: "Low",
        tags: ["transit", "U-Pass", "OC Transpo"],
      },

      // --- First Month ---
      {
        title: "Understanding Your Syllabus",
        description: "How to read a syllabus, identify exam dates, grade weightings, and professor expectations.",
        articleBody: "A syllabus is essentially a contract between you and your professor. During the first week of classes, thoroughly review the syllabus for each of your courses. Pay close attention to the grading scheme—some courses might heavily weight final exams, while others rely on continuous assessments like essays and midterms. Note down all important deadlines in your personal calendar. Also, check the professor's office hours; attending these hours early in the semester is a great way to introduce yourself and seek help.",
        category: "Academic",
        step: "First Month",
        priority: "High",
        tags: ["syllabus", "courses", "evaluation"],
      },
      {
        title: "Health and Wellness Resources",
        description: "Services of the campus health clinic, free psychological support, and wellness resources available on campus.",
        articleBody: "University can be stressful, and prioritizing your health is essential. uOttawa provides a comprehensive health clinic on campus where you can consult doctors and nurses natively. Beyond physical health, the university also provides robust mental health services, including free counseling and 24/7 crisis lines. If you feel overwhelmed, do not hesitate to reach out. Wellness programs also include pet therapy, yoga sessions, and peer support groups operating across the campus.",
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
        title: "Tutoring and Academic Support",
        description: "The Academic Writing Help Centre, peer mentoring, and study skills workshops are available for free.",
        articleBody: "No matter your academic level, everyone can benefit from academic support. The Academic Writing Help Centre (AWHC) offers free consultations to help you structure essays, improve grammar, and correctly format citations. Additionally, many faculties run peer mentoring programs where senior students help freshmen understand difficult concepts in challenging subjects (like mathematics or programming). Don't wait until the midterm to seek help—utilize these free resources early in the semester to build a strong foundation.",
        category: "Academic",
        step: "First Month",
        priority: "Medium",
        tags: ["tutoring", "support", "mentoring"],
      },
      {
        title: "Exploring Clubs and Associations",
        description: "Over 250 student clubs at uOttawa. Sports, culture, technology, volunteering — find your community.",
        articleBody: "University is not just about academics; it's about building a network and developing soft skills. With over 250 registered clubs, you're bound to find a community that shares your passions. From cultural organizations and competitive debate teams to robotics clubs and environmental activism groups, getting involved is a fantastic way to destress and boost your resume. Keep an eye out for Club Fairs happening in the main squares or check the online student portal's club directory.",
        category: "Student Life",
        step: "First Month",
        priority: "Low",
        tags: ["clubs", "associations", "community"],
      },

      // --- Mid-Term ---
      {
        title: "Understanding GPA Calculation",
        description: "GPA (Grade Point Average) is calculated on a 10-point scale at uOttawa. Here is how to calculate it and what academic probation means.",
        articleBody: "uOttawa uses a 10-point grading scale, which can be confusing if you are used to the 4.0 scale or percentage grades. An A+ is worth 10 points, an A is 9 points, and so on. Your CGPA (Cumulative Grade Point Average) is the average of the grade points earned in all your courses. Maintaining a good CGPA is crucial for graduation, scholarships, and co-op eligibility. If your CGPA falls below a certain threshold (usually 4.0 or 5.0 depending on the program), you may be placed on academic probation.",
        category: "Academic",
        step: "Mid-Term",
        priority: "High",
        tags: ["GPA", "grades", "probation"],
      },
      {
        title: "Academic Integrity and Plagiarism",
        description: "uOttawa's rules on plagiarism, fraud, and inappropriate collaboration. Consequences and how to avoid mistakes.",
        articleBody: "Academic integrity is taken extremely seriously in Canadian universities. Plagiarism includes copying text without citation, submitting someone else's work as your own, and unapproved collaboration on individual assignments. The consequences for academic fraud range from a zero on the assignment to expulsion from the university. Always cite your sources meticulously using the format requested by your professor (APA, MLA, IEEE, etc.). If you are unsure whether an action constitutes plagiarism, ask your professor or consult the writing center.",
        category: "Academic",
        step: "Mid-Term",
        priority: "High",
        tags: ["plagiarism", "integrity", "regulations"],
      },
      {
        title: "Planning Your Revisions",
        description: "Effective revision techniques: Pomodoro method, flashcards, study groups. Accessing study rooms on campus.",
        articleBody: "Midterm season can quickly become overwhelming if you do not plan ahead. Start revising at least two weeks before your exams. Break your study sessions into manageable chunks using techniques like the Pomodoro method (25 minutes of studying followed by a 5-minute break). Active recall and formulating flashcards are scientifically proven to be more effective than simply re-reading notes. Also, take advantage of the quiet study rooms in Morisset Library or CRX, which can be booked online through the library portal.",
        category: "Academic",
        step: "Mid-Term",
        priority: "Medium",
        tags: ["revision", "exams", "studying"],
      },
      {
        title: "Dropping a Course Without Penalty",
        description: "Deadline to drop a course without an academic penalty on your transcript. How to evaluate if you should drop a course.",
        articleBody: "If you realize that a course is too difficult or overwhelming, you have the option to drop it before a specific deadline without it affecting your GPA. Dropping a course before this deadline means it will not appear on your transcript or it will appear with a 'W' (Withdrawal) instead of a failing grade. Always check the 'Important Dates and Deadlines' page on the university website to know these exact dates. Consult an academic advisor before making a decision, as dropping a course might delay your graduation or affect your full-time student status.",
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
        title: "Welcome to UO-Compagnon!",
        message: "Your companion platform is ready. Explore the contents adapted to your current phase.",
        date: new Date().toISOString(),
        type: "success",
        relatedStep: "Before Arrival",
      },
      {
        title: "Course Registration Deadline",
        message: "Don't forget to finalize your course selection before the deadline on uoZone.",
        date: new Date().toISOString(),
        type: "warning",
        relatedStep: "Welcome Week",
      },
      {
        title: "First Assignment Due",
        message: "Check assignment deadlines on Brightspace. Most first assignments are due in the first 2-3 weeks.",
        date: new Date().toISOString(),
        type: "info",
        relatedStep: "First Month",
      },
      {
        title: "Mid-Term Exams Approaching",
        message: "The mid-term exam period is starting soon. Check your exam schedule on uoZone.",
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
