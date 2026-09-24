import { AdminPanel } from './AdminPanel/AdminPanel';
import { TacticalCursor } from './components/TacticalCursor';

function App() {
  return (
    <>
      <TacticalCursor />
      <AdminPanel
        onExit={() => {
          window.location.href = 'http://localhost:3000';
        }}
      />
    </>
  );
}

export default App;
