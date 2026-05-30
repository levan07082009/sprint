import StudentDashboard from "@/components/StudentDashboard";
import { getRecommendedGigs } from "@/app/actions/gigs";

export default async function StudentDashboardPage() {
  const gigs = await getRecommendedGigs();
  
  return <StudentDashboard recommendedGigs={gigs} />;
}
