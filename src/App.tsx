import { MotionConfig } from "framer-motion";
import { AppRoutes } from "@/routes/AppRoutes";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={200}>
        <AppRoutes />
      </TooltipProvider>
    </MotionConfig>
  );
}

export default App;
