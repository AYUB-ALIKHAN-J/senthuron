
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'created' | 'pending' | 'deleted';
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    created: {
      bgColor: 'bg-success/20',
      textColor: 'text-success',
      label: 'Created'
    },
    pending: {
      bgColor: 'bg-warning/20',
      textColor: 'text-warning',
      label: 'Pending'
    },
    deleted: {
      bgColor: 'bg-destructive/20',
      textColor: 'text-destructive',
      label: 'Deleted'
    }
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
