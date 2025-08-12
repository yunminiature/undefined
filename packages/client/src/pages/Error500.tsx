import ErrorComponent from '@/components/common/ErrorComponent';

export default function Error500() {
  return (
    <ErrorComponent
      code={500}
      title='Internal Server Error'
      description="Sorry, something went wrong on our end. We're working to fix the issue."
    />
  );
}
