import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { CV } from '@/api/cvApi';
import { FileText, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CVCardProps {
  cv: CV;
  onViewDetails: (id: number) => void;
}

export function CVCard({ cv, onViewDetails }: CVCardProps) {
  return (
    <Card className="hover:shadow-hover transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <h3 className="font-semibold truncate" title={cv.file.split('/').pop() || ''}>
              {cv.file.split('/').pop()}
            </h3>
          </div>
          <StatusBadge status={cv.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Uploaded {formatDistanceToNow(new Date(cv.uploaded_at), { addSuffix: true })}</span>
        </div>
        {cv.status === 'Processed' && cv.processed_at && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Processed in {cv.processing_time.toFixed(2)}s</span>
          </div>
        )}
        {cv.top_skills && cv.top_skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {cv.top_skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-md bg-accent text-accent-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onViewDetails(cv.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
