import { PageId } from '../app/App';

interface AppRouterProps {
  page: PageId;
}

export function AppRouter({ page }: AppRouterProps) {
  switch (page) {
    case 'dashboard':
      return <DashboardPage />;
    case 'payments':
      return <PaymentsPage />;
    case 'monthly-bill':
      return <div>DataPage for monthly-bill</div>; // Placeholder
    case 'payment-history':
      return <PaymentHistoryPage />;
    case 'slip-verify':
      return <div>DataPage for slip-verify</div>; // Placeholder
    case 'water-record':
      return <div>WaterRecordPage</div>; // Placeholder
    case 'electricity-record':
      return <div>ElectricityRecordPage</div>; // Placeholder
    case 'requests':
      return <div>DataPage for requests</div>; // Placeholder
    case 'forms':
      return <div>FormsPage</div>; // Placeholder
    case 'admin-requests':
      return <div>DataPage for admin-requests</div>; // Placeholder
    case 'accounting':
      return <div>DataPage for accounting</div>; // Placeholder
    case 'expenses':
      return <div>DataPage for expenses</div>; // Placeholder
    case 'disbursement':
      return <div>DataPage for disbursement</div>; // Placeholder
    case 'regulations':
      return <div>DataPage for regulations</div>; // Placeholder
    case 'profile':
      return <div>ProfilePage</div>; // Placeholder
    case 'admin-settings':
      return <div>AdminSettingsPage</div>; // Placeholder
    case 'send-slip':
      return <SendSlipPage />;
    default:
      return <DashboardPage />;
  }
}

function SendSlipPage() {
  return <div>Send Slip Page</div>;
}

const DashboardPage = () => <div>Dashboard</div>;
const PaymentsPage = () => <div>Payments</div>;
const PaymentHistoryPage = () => <div>Payment History</div>;