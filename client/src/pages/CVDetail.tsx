import { useParams, useNavigate } from 'react-router-dom';
import { useCVDetail } from '@/hooks/useCVs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, FileText, User, Building2, Calendar, Briefcase, GraduationCap, Code } from 'lucide-react';

export default function CVDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cv, isLoading, isError } = useCVDetail(Number(id));

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (isError || !cv) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Button variant="outline" onClick={() => navigate('/cvs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
        <Alert className="border-destructive bg-destructive/10">
          <AlertDescription className="text-destructive-foreground">
            Failed to load CV details.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/cvs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
        <StatusBadge status={cv.status} />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{cv.file.split('/').pop()}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>ID: {cv.id}</span>
          <span>•</span>
          <span>Uploaded: {new Date(cv.uploaded_at).toLocaleString()}</span>
          {cv.processed_at && (
            <>
              <span>•</span>
              <span>Processing time: {cv.processing_time.toFixed(2)}s</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Name
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cv.entities.name && cv.entities.name.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cv.entities.name.map((name, i) => (
                  <span key={i} className="px-3 py-1 rounded-md bg-accent text-accent-foreground">
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No names detected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cv.entities.organizations && cv.entities.organizations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cv.entities.organizations.map((org, i) => (
                  <span key={i} className="px-3 py-1 rounded-md bg-accent text-accent-foreground">
                    {org}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No organizations detected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cv.entities.skills && cv.entities.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cv.entities.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-md bg-primary/10 text-primary font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No skills detected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cv.entities.education && cv.entities.education.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cv.entities.education.map((edu, i) => (
                  <span key={i} className="px-3 py-1 rounded-md bg-secondary/10 text-secondary font-medium">
                    {edu}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No education detected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cv.entities.experience && cv.entities.experience.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cv.entities.experience.map((exp, i) => (
                  <span key={i} className="px-3 py-1 rounded-md bg-accent text-accent-foreground">
                    {exp}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No experience data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cv.entities.dates && cv.entities.dates.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {cv.entities.dates.slice(0, 10).map((date, i) => (
                  <span key={i} className="px-3 py-1 rounded-md bg-muted text-muted-foreground">
                    {date}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No dates detected</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Extracted Text
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cv.extracted_text ? (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto max-h-96">
                {cv.extracted_text}
              </pre>
            </div>
          ) : (
            <p className="text-muted-foreground">No text extracted</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
