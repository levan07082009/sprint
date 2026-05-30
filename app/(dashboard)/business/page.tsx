import EmployerDashboard from "@/components/EmployerDashboard";
import { getMyPostedGigs } from "@/app/actions/gigs";

export default async function BusinessDashboardPage() {
  const gigs = await getMyPostedGigs();
  
  return <EmployerDashboard gigs={gigs} />;
}
