import Layout from '@/components/App.Layout';
import { FormRequestProvider } from '@/context/FormRequest';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // <FormRequestProvider>
    <Layout>{children}</Layout>
    // </FormRequestProvider>
  );
}
