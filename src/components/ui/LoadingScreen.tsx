import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-light-border border-t-primary-600 dark:border-dark-border dark:border-t-primary-500"></div>
        <p className="mt-4 text-light-textSecondary dark:text-dark-textSecondary">Loading...</p>
      </div>
    </div>
  );
}