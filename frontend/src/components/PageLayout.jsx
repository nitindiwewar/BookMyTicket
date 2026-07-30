import { Suspense } from "react";
import Card from "./ui/Card.jsx";

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <Card className="p-6">
        <div className="space-y-3">
          <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-full max-w-md animate-pulse rounded bg-white/10" />
        </div>
      </Card>
    </div>
  );
}

/**
 * Layout wrapper with Suspense boundary
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content to render
 * @returns {JSX.Element}
 */
export function PageLayout({ children }) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

export default PageLayout;
