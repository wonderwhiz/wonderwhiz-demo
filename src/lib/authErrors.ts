export type AuthFormError = {
  title: string;
  detail?: string;
  /** Suggested recovery action for the UI to surface. */
  action?: 'reset-password' | 'resend-confirmation' | 'switch-to-login' | 'retry';
};

const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

const looksLikeNetworkError = (error: any) =>
  isOffline() ||
  error?.name === 'TypeError' ||
  error?.name === 'AuthRetryableFetchError' ||
  /failed to fetch|network|load failed/i.test(error?.message ?? '');

export function mapSignInError(error: any): AuthFormError {
  if (looksLikeNetworkError(error)) {
    return {
      title: "Can't reach WonderWhiz right now",
      detail: 'Check your internet connection and try again.',
      action: 'retry',
    };
  }

  const code = error?.code ?? '';
  const message: string = error?.message ?? '';

  if (code === 'email_not_confirmed' || /email not confirmed/i.test(message)) {
    return {
      title: 'Please confirm your email first',
      detail: 'We sent a confirmation link when you signed up. Open it, then sign in again.',
      action: 'resend-confirmation',
    };
  }

  if (code === 'invalid_credentials' || /invalid login credentials/i.test(message)) {
    return {
      title: 'That email and password don’t match',
      detail: 'Double-check your password, or reset it if you’ve forgotten it.',
      action: 'reset-password',
    };
  }

  if (error?.status === 429 || code === 'over_request_rate_limit') {
    return {
      title: 'Too many attempts',
      detail: 'Wait a minute before trying again.',
      action: 'retry',
    };
  }

  return { title: 'Sign in failed', detail: message || 'Please try again.', action: 'retry' };
}

export function mapSignUpError(error: any): AuthFormError {
  if (looksLikeNetworkError(error)) {
    return {
      title: "Can't reach WonderWhiz right now",
      detail: 'Check your internet connection and try again.',
      action: 'retry',
    };
  }

  const code = error?.code ?? '';
  const message: string = error?.message ?? '';

  if (code === 'user_already_exists' || /already registered|already exists/i.test(message)) {
    return {
      title: 'That email already has an account',
      detail: 'Sign in instead, or reset your password if you’ve forgotten it.',
      action: 'switch-to-login',
    };
  }

  if (code === 'weak_password' || /password should be at least|weak password/i.test(message)) {
    return {
      title: 'Pick a stronger password',
      detail: 'Use at least 6 characters — a mix of words and numbers works well.',
    };
  }

  if (code === 'validation_failed' || /invalid email/i.test(message)) {
    return { title: 'That email address looks off', detail: 'Check for typos and try again.' };
  }

  if (error?.status === 429 || code === 'over_email_send_rate_limit') {
    return {
      title: 'Too many sign-up attempts',
      detail: 'Please wait a few minutes before trying again.',
      action: 'retry',
    };
  }

  return { title: 'Sign up failed', detail: message || 'Please try again.', action: 'retry' };
}

export function mapPasswordResetError(error: any): AuthFormError {
  if (looksLikeNetworkError(error)) {
    return {
      title: "Can't reach WonderWhiz right now",
      detail: 'Check your internet connection and try again.',
      action: 'retry',
    };
  }
  if (error?.status === 429) {
    return { title: 'Too many reset emails', detail: 'Please wait a few minutes and try again.' };
  }
  return { title: 'Could not send reset link', detail: error?.message || 'Please try again.' };
}
