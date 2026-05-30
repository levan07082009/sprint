import { createBrowserRouter, Navigate } from "react-router";
import { StudentShell } from "./components/StudentShell";
import { BusinessShell } from "./components/BusinessShell";
import { StudentHome } from "./pages/StudentHome";
import { BusinessDashboard } from "./pages/BusinessDashboard";
import { StudentBrowse } from "./pages/StudentBrowse";
import { BusinessTalentNetwork } from "./pages/BusinessTalentNetwork";
import { StudentMessages } from "./pages/StudentMessages";
import { BusinessMessages } from "./pages/BusinessMessages";
import { StudentProfile } from "./pages/StudentProfile";
import { BusinessProfile } from "./pages/BusinessProfile";
import { BusinessTasks } from "./pages/BusinessTasks";
import { Onboarding } from "./pages/Onboarding";

// Individual components
import { IndividualShell } from "./components/IndividualShell";
import { IndividualDashboard } from "./pages/individual/Dashboard";
import { IndividualTalentNetwork } from "./pages/individual/Talent";
import { IndividualTasks } from "./pages/individual/Tasks";
import { IndividualMessages } from "./pages/individual/Messages";
import { IndividualProfile } from "./pages/individual/Profile";

const role = localStorage.getItem("sprint_role");

// Auth Guard Component for root path
const RootRedirect = () => {
  if (!role) return <Navigate to="/onboarding" replace />;
  if (role === "student") return <StudentShell />;
  if (role === "individual") return <Navigate to="/individual" replace />;
  return <BusinessShell />;
};

export const router = createBrowserRouter([
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  // We'll expose the individual route regardless of localstorage so you can test it directly
  {
    path: "/individual",
    Component: IndividualShell,
    children: [
      { index: true, Component: IndividualDashboard },
      { path: "talent", Component: IndividualTalentNetwork },
      { path: "tasks", Component: IndividualTasks },
      { path: "messages", Component: IndividualMessages },
      { path: "profile", Component: IndividualProfile },
    ]
  },
  ...(role === "student"
    ? [
        {
          path: "/",
          Component: StudentShell,
          children: [
            { index: true, Component: StudentHome },
            { path: "browse", Component: StudentBrowse },
            { path: "messages", Component: StudentMessages },
            { path: "profile", Component: StudentProfile },
          ],
        },
      ]
    : role === "enterprise"
    ? [
        {
          path: "/",
          Component: BusinessShell,
          children: [
            { index: true, Component: BusinessDashboard },
            { path: "talent", Component: BusinessTalentNetwork },
            { path: "tasks", Component: BusinessTasks },
            { path: "messages", Component: BusinessMessages },
            { path: "profile", Component: BusinessProfile },
          ],
        },
      ]
    : [
        {
          path: "/",
          Component: RootRedirect,
        },
      ]),
]);
