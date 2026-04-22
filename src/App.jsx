import Navbar from './components/Layout/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
