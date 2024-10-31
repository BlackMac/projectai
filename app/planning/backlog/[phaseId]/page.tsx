import { getBacklogForPhase } from '@/app/actions/backlog';
import { BacklogView } from '@/app/components/BacklogView';
import { notFound } from 'next/navigation';

interface BacklogPageProps {
  params: {
    phaseId: string;
  };
}

export default async function BacklogPage({ params }: BacklogPageProps) {
  const backlog = await getBacklogForPhase(params.phaseId);

  if (!backlog) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BacklogView backlog={backlog} />
    </div>
  );
} 