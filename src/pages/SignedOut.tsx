import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignedOut() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <LogOut className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </span>
      <h1 className="text-lg font-semibold">You've been signed out</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This is a demo project with simulated data, so there is no real login.
        Sign back in to return to the dashboard.
      </p>
      <Button asChild size="sm">
        <Link to="/">Sign in again</Link>
      </Button>
    </div>
  );
}