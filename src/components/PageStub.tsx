interface PageStubProps {
  title: string
  description?: string
}

export function PageStub({ title, description }: PageStubProps) {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-ink">{title}</h1>
      {description ? <p className="mt-2 text-muted">{description}</p> : null}
    </div>
  )
}
