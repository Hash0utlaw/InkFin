import TattooDesignGenerator from '@/components/TattooDesignGenerator'

export default function DesignPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4 text-center">Create Your Custom Tattoo Design</h1>
        <p className="text-xl mb-8 text-center">
          Use our AI-powered tool to bring your tattoo ideas to life. Describe your vision, and watch as we generate a unique design just for you.
        </p>
        <TattooDesignGenerator />
      </div>
    </main>
  )
}