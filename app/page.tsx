import { AppProvider } from '@/lib/app-context';
import { ThadamApp } from '@/components/thadam-app';

export default function Page() {
  return (
    <AppProvider>
      <ThadamApp />
    </AppProvider>
  );
}
