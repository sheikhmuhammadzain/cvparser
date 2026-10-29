import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'Pending' | 'Processed' | 'Failed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    Pending: {
      variant: 'outline' as const,
      className: 'border-warning bg-warning/10 text-orange-700 dark:text-orange-300',
      icon: Clock,
    },
    Processed: {
      variant: 'outline' as const,
      className: 'border-success bg-success/10 text-green-700 dark:text-green-300',
      icon: CheckCircle2,
    },
    Failed: {
      variant: 'outline' as const,
      className: 'border-destructive bg-destructive/10 text-red-700 dark:text-red-300',
      icon: XCircle,
    },
  };

  const config = variants[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {status}
    </Badge>
  );
}
