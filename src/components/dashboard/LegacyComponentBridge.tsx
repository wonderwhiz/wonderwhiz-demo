
import React from 'react';
import MagicalSearchBar from './MagicalSearchBar';
import WelcomeView from './WelcomeView';

// Legacy components compatibility layer
// These help with the transition from old components to new ones

// Legacy UnifiedSearchBar compatibility
export const UnifiedSearchBar = MagicalSearchBar;

// Legacy EnhancedSearchBar compatibility
export const EnhancedSearchBar = MagicalSearchBar;

// Legacy UnifiedDashboard compatibility
export const UnifiedDashboard = (props: any) => {
  return <WelcomeView {...props} />;
};

export default {
  UnifiedSearchBar,
  EnhancedSearchBar,
  UnifiedDashboard
};
