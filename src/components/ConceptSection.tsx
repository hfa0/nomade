import InViewAnimation from '@/components/InViewAnimation';

export default function ConceptSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-light">
      <InViewAnimation className="max-w-3xl mx-auto">
        <h2 className="font-cooper text-primary text-3xl md:text-4xl font-bold uppercase text-center mb-10">
          The Concept
        </h2>
        <p className="text-gray-800 text-lg text-center mb-6">
          NOMADE. PRESTIGE fuses High Fashion with cultural heritage — a synthesis that defines our identity.
        </p>
        <p className="text-gray-700 text-center mb-10">
          A curated <strong className="text-primary">runway show</strong>, oriental <strong className="text-primary">house sound</strong> and refined <strong className="text-primary">luxury staging</strong> converge into an immersive experience — crafted for Düsseldorf and beyond.
        </p>
        <div className="space-y-4 text-center">
          <p className="font-cooper text-primary text-xl font-bold">Fashion becomes stage.</p>
          <p className="font-cooper text-primary text-xl font-bold">Culture becomes statement.</p>
          <p className="font-cooper text-primary text-xl font-bold">Community becomes movement.</p>
        </div>
        <p className="text-gray-500 text-sm uppercase tracking-widest text-center mt-12">
          Fashion · Art · Music
        </p>
      </InViewAnimation>
    </section>
  );
}
