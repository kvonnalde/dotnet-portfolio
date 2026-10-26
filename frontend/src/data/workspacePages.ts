import { aboutContent } from "./about";
import { certifications } from "./certifications";
import { contactContent } from "./contact";
import { education } from "./education";
import { employment } from "./employment";
import { homeContent } from "./home";
import { projects } from "./projects";
import { services } from "./services";
import { skills } from "./tools";

export const workspacePages = [
  { label: "Home", file: "Home.md", to: "/", group: "pages", content: [homeContent, projects, aboutContent, certifications, services] },
  { label: "Projects", file: "Projects.md", to: "/projects", group: "pages", content: projects },
  { label: "Services", file: "Services.md", to: "/services", group: "pages", content: services },
  { label: "Tools", file: "Tools.md", to: "/tools", group: "pages", content: skills },
  { label: "About", file: "About.md", to: "/about", group: "profile", content: [aboutContent, education, employment, certifications] },
  { label: "Contact", file: "Contact.md", to: "/contact", group: "profile", content: contactContent },
].map(({ content, ...page }) => ({
  ...page,
  end: page.to === "/",
  searchText: `${page.label} ${page.file} ${JSON.stringify(content)}`.toLowerCase(),
}));
