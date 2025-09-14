declare module './ClientLayout' {
  import { ReactNode } from 'react';
  
  interface ClientLayoutProps {
    children: ReactNode;
    initialLocale: string;
  }
  
  const ClientLayout: React.FC<ClientLayoutProps>;
  
  export default ClientLayout;
}
