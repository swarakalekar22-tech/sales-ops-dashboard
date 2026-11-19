import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-lg font-semibold">This page doesn't exist</h1>
      <Button asChild size="sm">
        <Link to="/">Back to overview</Link>
      </Button>
    </div>
  );
}
