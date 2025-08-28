// app/dashboard/page.tsx
import DashboardClient from './Client';

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { leagueId?: string };
}) {
  const leagueId = searchParams?.leagueId ?? '12345';
  return <DashboardClient leagueId={leagueId} />;
}
