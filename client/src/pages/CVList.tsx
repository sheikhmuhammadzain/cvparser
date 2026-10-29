import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCVs } from '@/hooks/useCVs';
import { CVCard } from '@/components/CVCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function CVList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useCVs(page);
  const navigate = useNavigate();

  const handleViewDetails = (id: number) => {
    navigate(`/cvs/${id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">CV List</h1>
          <p className="text-muted-foreground">Loading CVs...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">CV List</h1>
          <p className="text-muted-foreground">All uploaded resumes</p>
        </div>
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive-foreground">
            Failed to load CVs. Please check your connection to the Django API.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">CV List</h1>
          <p className="text-muted-foreground">
            {data?.count} total resumes
          </p>
        </div>
      </div>

      {data?.results.length === 0 ? (
        <Alert>
          <AlertDescription>
            No CVs uploaded yet. Go to the Upload page to add some resumes.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.results.map((cv) => (
              <CVCard key={cv.id} cv={cv} onViewDetails={handleViewDetails} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
