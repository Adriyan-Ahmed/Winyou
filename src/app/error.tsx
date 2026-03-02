"use client";

import ErrorComponent from "@/components/shared/ErrorComponent";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorComponent
      title="Something went wrong!"
      message={error.message || "An unexpected error occurred"}
      statusCode={500}
      showHomeButton={true}
    />
  );
}
