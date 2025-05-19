
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to the auth page by default
  return <Navigate to="/auth" replace />;
};

export default Index;
