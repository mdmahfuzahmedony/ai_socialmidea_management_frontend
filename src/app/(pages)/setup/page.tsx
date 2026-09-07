import SetupWizard from '@/components/SetupWizard';
import { Suspense } from 'react';


export default function SetupPage() {
  return (
    <Suspense fallback={null}>
      <SetupWizard />
    </Suspense>
  );
}
