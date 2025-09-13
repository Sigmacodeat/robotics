import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ErrorMessageProps = {
  title?: string;
  message: string;
  className?: string;
};

export default function ErrorMessage({ 
  title = 'Error', 
  message, 
  className 
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className={className}>
      <span aria-hidden className="h-4 w-4 inline-flex items-center justify-center">!</span>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
}
