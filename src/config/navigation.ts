import {
  AcademicCapIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

export const mainNavItems = [
  {
    title: "Learning Hub",
    href: "/topics",
    description: "Notes, roadmaps, cheat sheets & flashcards",
  },
  {
    title: "Interview Prep",
    href: "/interview",
    description: "Technical, HR & coding interview questions",
  },
  {
    title: "Coding",
    href: "/coding",
    description: "DSA problems & coding challenges",
  },
  {
    title: "System Design",
    href: "/system-design",
    description: "HLD, LLD & architecture patterns",
  },
  {
    title: "AI Tools",
    href: "/ai-tools",
    description: "AI Tutor, Mock Interview & Resume Review",
  },
  {
    title: "Community",
    href: "/community",
    description: "Discussions & interview experiences",
  },
];

export const features = [
  {
    title: "AI Tutor",
    description: "Get instant answers to your technical doubts with our AI-powered tutor.",
    icon: SparklesIcon,
    href: "/ai-tools/tutor",
  },
  {
    title: "Mock Interviews",
    description: "Practice with AI-driven mock interviews tailored to your target role.",
    icon: ChatBubbleLeftRightIcon,
    href: "/ai-tools/mock-interview",
  },
  {
    title: "Resume Review",
    description: "Get your resume ATS-checked and optimized by AI.",
    icon: DocumentTextIcon,
    href: "/ai-tools/resume-review",
  },
  {
    title: "Learning Roadmaps",
    description: "Follow personalized, step-by-step learning paths for any tech stack.",
    icon: RocketLaunchIcon,
    href: "/roadmaps",
  },
  {
    title: "Coding Practice",
    description: "Solve DSA problems with an integrated code editor and test cases.",
    icon: CommandLineIcon,
    href: "/coding",
  },
  {
    title: "Company Prep",
    description: "Prepare for specific companies with curated question banks.",
    icon: BuildingOffice2Icon,
    href: "/companies",
  },
  {
    title: "Community",
    description: "Share and read real interview experiences from engineers worldwide.",
    icon: UserGroupIcon,
    href: "/community",
  },
  {
    title: "Study Planner",
    description: "AI generates a personalized study plan based on your timeline & goals.",
    icon: AcademicCapIcon,
    href: "/ai-tools/study-planner",
  },
];

export const footerLinks = {
  product: [
    { title: "Learning Hub", href: "/topics" },
    { title: "Interview Prep", href: "/interview" },
    { title: "Coding Practice", href: "/coding" },
    { title: "System Design", href: "/system-design" },
    { title: "AI Tools", href: "/ai-tools" },
  ],
  resources: [
    { title: "Roadmaps", href: "/roadmaps" },
    { title: "Cheat Sheets", href: "/cheat-sheets" },
    { title: "Flashcards", href: "/flashcards" },
    { title: "Blog", href: "/blog" },
    { title: "Community", href: "/community" },
  ],
  company: [
    { title: "About", href: "/about" },
    { title: "Pricing", href: "/pricing" },
    { title: "Careers", href: "/careers" },
    { title: "Contact", href: "/contact" },
    { title: "Privacy Policy", href: "/privacy" },
  ],
};
