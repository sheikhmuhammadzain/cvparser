import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilterCVs } from '@/hooks/useCVs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CVCard } from '@/components/CVCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Filter as FilterIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect, type Option } from '@/components/MultiSelect';

export default function Filter() {
  const [education, setEducation] = useState<string>('Bachelor');
  const [skills, setSkills] = useState<string[]>(['python','react','django']);
  const [experience, setExperience] = useState<string>('2');
  const [keywords, setKeywords] = useState<string[]>(['api','team']);

  const educationOptions: Option[] = useMemo(() => [
    { label: 'Intermediate', value: 'Intermediate' },
    { label: "Bachelor's", value: 'Bachelor' },
    { label: "Master's", value: 'Master' },
    { label: 'PhD', value: 'PhD' },
  ], []);

  const skillOptions: Option[] = useMemo(() => [
    'Python','JavaScript','TypeScript','Java','C#','SQL','Django','React','Node.js','Machine Learning','Deep Learning','NLP','Computer Vision','Docker','Kubernetes','AWS','GCP','Azure','Data Analysis','Project Management'
  ].map(s => ({ label: s, value: s.toLowerCase() })), []);

  const keywordOptions: Option[] = useMemo(() => [
    'leadership','agile','scrum','team','communication','api','microservices','rest','design patterns','cloud','devops','testing','ci/cd'
  ].map(k => ({ label: k, value: k })), []);

  const experienceOptions = useMemo(() => Array.from({ length: 16 }, (_, i) => String(i)), []);
  
  const filterMutation = useFilterCVs();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: any = {};
    if (education) payload.education = education;
    if (skills.length) payload.skills = skills;
    if (experience) payload.experience = experience;
    if (keywords.length) payload.keywords = keywords;

    if (Object.keys(payload).length === 0) {
      toast.error('Please enter at least one filter criterion');
      return;
    }

    try {
      await filterMutation.mutateAsync(payload);
      toast.success(`Found ${filterMutation.data?.count || 0} matching CVs`);
    } catch (error) {
      toast.error('Filter failed. Please try again.');
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/cvs/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Filter & Rank CVs</h1>
        <p className="text-muted-foreground">
          Search and rank resumes based on specific criteria
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Criteria</CardTitle>
          <CardDescription>
            Enter one or more criteria to filter and rank CVs. Results will be scored based on matches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Education Level</Label>
                <Select value={education} onValueChange={setEducation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Required Skills</Label>
                <MultiSelect
                  options={skillOptions}
                  value={skills}
                  onChange={setSkills}
                  placeholder="Select skills"
                />
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <MultiSelect
                  options={keywordOptions}
                  value={keywords}
                  onChange={setKeywords}
                  placeholder="Select keywords"
                />
              </div>
            </div>

            <Button type="submit" disabled={filterMutation.isPending} className="w-full">
              {filterMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Filtering...
                </>
              ) : (
                <>
                  <FilterIcon className="mr-2 h-4 w-4" />
                  Filter CVs
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {filterMutation.isError && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive-foreground">
            Filter failed. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      )}

      {filterMutation.isSuccess && filterMutation.data && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Results ({filterMutation.data.count} matches)
            </h2>
          </div>

          {filterMutation.data.results.length === 0 ? (
            <Alert>
              <AlertDescription>
                No CVs match the specified criteria. Try adjusting your filters.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filterMutation.data.results.map((result, index) => (
                <Card key={result.cv.id} className="group hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Rank badge */}
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          #{index + 1}
                        </div>
                      </div>

                      {/* Center: CV Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {result.cv.file.split('/').pop()}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Uploaded {new Date(result.cv.uploaded_at).toLocaleDateString()} • 
                              {result.cv.processing_time ? ` Processed in ${result.cv.processing_time.toFixed(2)}s` : ' Processing...'}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-sm">
                              Score: {result.score.toFixed(1)}
                            </div>
                          </div>
                        </div>

                        {/* Match badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {result.matches.education && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs font-medium border border-green-200 dark:border-green-800">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Education Match
                            </span>
                          )}
                          {result.matches.skills > 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {result.matches.skills} Skill{result.matches.skills > 1 ? 's' : ''}
                            </span>
                          )}
                          {result.matches.experience && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-800">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Experience Match
                            </span>
                          )}
                          {result.matches.keywords > 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-800">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {result.matches.keywords} Keyword{result.matches.keywords > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        {/* Action button */}
                        <Button
                          onClick={() => handleViewDetails(result.cv.id)}
                          className="w-full sm:w-auto"
                          size="sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Full Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
