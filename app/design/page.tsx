import TattooDesignGenerator from '@/components/TattooDesignGenerator'

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/design-background.jpg.png')" }}>
      <div className="bg-white bg-opacity-10 min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4 text-center">Create Your Custom Tattoo Design</h1>
          <p className="text-xl mb-8 text-center">
            Use our AI-powered tool to bring your tattoo ideas to life. Describe your vision, and watch as we generate a unique design just for you.
          </p>
          <TattooDesignGenerator />
        </main>
      </div>
    </div>
  );
}