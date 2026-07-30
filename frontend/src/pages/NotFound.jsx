import { Link } from "react-router-dom";
import { Film, Home } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-20 text-center">
      <Card className="p-8 flex flex-col items-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 font-bold text-2xl">
          404
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>

        <Button as={Link} to="/" className="mt-4 gap-2">
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </Card>
    </div>
  );
}
