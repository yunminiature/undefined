import ErrorComponent from '@/components/common/ErrorComponent'

export default function Error400() {
  return (
    <ErrorComponent
      code={400}
      title="Bad Request"
      description="Sorry, your request contains an error and cannot be processed by the server."
    />
  )
}
