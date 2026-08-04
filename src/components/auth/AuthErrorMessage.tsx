import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { AuthFormError } from '@/lib/authErrors';

interface AuthErrorMessageProps {
  error: AuthFormError | null;
  onAction?: () => void;
  actionLabel?: string;
}

const AuthErrorMessage: React.FC<AuthErrorMessageProps> = ({ error, onAction, actionLabel }) => {
  if (!error) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex gap-3 rounded-xl border border-destructive/40 bg-destructive/15 p-3 text-left"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-destructive-foreground">{error.title}</p>
        {error.detail && <p className="text-xs text-destructive-foreground/80">{error.detail}</p>}
        {onAction && actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-semibold text-destructive-foreground underline underline-offset-4"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthErrorMessage;
