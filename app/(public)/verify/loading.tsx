import { LoadingPulse } from "@/features/verification";

/** Shown while the route segment itself is still resolving. */
export default function VerifyLoading() {
  return <LoadingPulse label="Loading verification portal..." />;
}
