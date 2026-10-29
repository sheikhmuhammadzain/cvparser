import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { useUploadCVs } from '@/hooks/useCVs';
import { validateFile } from '@/api/cvApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Upload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadMutation = useUploadCVs();

  const handleFilesSelected = async (files: File[]) => {
    setUploadProgress(0);
    
    // Validate files before upload
    const validFiles: File[] = [];
    const invalidFiles: { name: string; error: string }[] = [];
    
    files.forEach(file => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ name: file.name, error: validation.error || 'Invalid file' });
      }
    });
    
    // Show validation errors
    if (invalidFiles.length > 0) {
      invalidFiles.forEach(({ name, error }) => {
        toast.error(`${name}: ${error}`);
      });
    }
    
    // Upload valid files
    if (validFiles.length === 0) {
      toast.error('No valid files to upload');
      return;
    }
    
    try {
      await uploadMutation.mutateAsync(validFiles);
      setUploadProgress(100);
    } catch (error) {
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload CVs</h1>
        <p className="text-muted-foreground">
          Upload multiple resumes to process and analyze
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>
            Select or drag and drop CV files to upload. Supported formats: PDF, DOCX, TXT, JPG, PNG (max 5MB each)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader
            onFilesSelected={handleFilesSelected}
            isUploading={uploadMutation.isPending}
            uploadProgress={uploadProgress}
          />
        </CardContent>
      </Card>

      {uploadMutation.isSuccess && uploadMutation.data && (
        <Alert className="border-success bg-success/10">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success-foreground">
            Successfully processed {uploadMutation.data.processed} of {uploadMutation.data.total} files
          </AlertDescription>
        </Alert>
      )}

      {uploadMutation.isError && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive-foreground">
            Upload failed. Please check your files and try again.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-disc list-inside space-y-2">
            <li>Maximum file size: 5MB per file</li>
            <li>Supported formats: PDF, DOCX, TXT, JPG, PNG</li>
            <li>Multiple files can be uploaded at once</li>
            <li>Files will be automatically processed to extract text and entities</li>
            <li>Processing typically takes 1-3 seconds per file</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
