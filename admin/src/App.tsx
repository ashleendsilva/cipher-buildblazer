import { AdminPanel } from './AdminPanel/AdminPanel';
import { TacticalCursor } from './components/TacticalCursor';

const PUBLIC_SITE_URL = 'https://cipherbuildblazer.netlify.app/';

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
