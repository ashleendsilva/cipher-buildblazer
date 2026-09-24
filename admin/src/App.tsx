import { AdminPanel } from './AdminPanel/AdminPanel';
import { TacticalCursor } from './components/TacticalCursor';

const PUBLIC_SITE_URL =
  import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:3000';

function App() {
  return (
    <>
      <TacticalCursor />
      <AdminPanel
        onExit={() => {
          window.location.href = PUBLIC_SITE_URL;
        }}
      />
    </>
  );
}

export default App;
