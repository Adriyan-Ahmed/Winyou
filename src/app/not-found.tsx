import ErrorComponent from "@/components/shared/ErrorComponent";

export default function NotFound() {
  return (
    <ErrorComponent
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      statusCode={404}
    />
  );
}
