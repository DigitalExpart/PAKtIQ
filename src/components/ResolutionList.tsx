import { Resolution } from '../App';
import { ResolutionCard } from './ResolutionCard';

interface ResolutionListProps {
  resolutions: Resolution[];
  onSelect: (resolution: Resolution) => void;
  onDelete: (id: string) => void;
}

export function ResolutionList({ resolutions, onSelect, onDelete }: ResolutionListProps) {
  return (
    <div className="space-y-3">
      {resolutions.map(resolution => (
        <ResolutionCard
          key={resolution.id}
          resolution={resolution}
          onClick={() => onSelect(resolution)}
          onDelete={() => onDelete(resolution.id)}
        />
      ))}
    </div>
  );
}
