import { 
    RouterProvider,
  } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createRouter } from './routes';
  
const AppRouter: React.FC = () => {
    const router = createRouter();
    return <RouterProvider router={router}/>;
};
  
function App() {
  
    return (
      <QueryClientProvider client={new QueryClient({})}>
        <AppRouter/>
      </QueryClientProvider>
    );
}
  
export default App;
  