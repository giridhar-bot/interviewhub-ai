import {
  CodeBracketIcon,
  AcademicCapIcon,
  CpuChipIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CommandLineIcon,
  CircleStackIcon,
  CloudIcon,
  ServerStackIcon,
  BeakerIcon,
  PresentationChartBarIcon,
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

export const topicCategories = [
  {
    title: "Backend",
    icon: ServerStackIcon,
    topics: ["Java", "Spring Boot", "Node.js", ".NET", "Python", "Go"],
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Frontend",
    icon: CodeBracketIcon,
    topics: ["React", "Angular", "Vue", "JavaScript", "TypeScript"],
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Cloud & DevOps",
    icon: CloudIcon,
    topics: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform"],
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Enterprise",
    icon: BuildingOffice2Icon,
    topics: ["SAP", "Salesforce", "ServiceNow"],
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Data",
    icon: CircleStackIcon,
    topics: ["SQL", "Data Engineering", "Power BI", "Snowflake", "Databricks"],
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
  },
  {
    title: "Testing",
    icon: BeakerIcon,
    topics: ["Manual QA", "Automation", "Selenium", "Cypress", "Playwright"],
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    title: "Architecture",
    icon: PresentationChartBarIcon,
    topics: ["HLD", "LLD", "Microservices", "System Design"],
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
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

export const stats = [
  { value: "500+", label: "Interview Topics" },
  { value: "10,000+", label: "Practice Questions" },
  { value: "50+", label: "Tech Stacks" },
  { value: "100K+", label: "Learners" },
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
