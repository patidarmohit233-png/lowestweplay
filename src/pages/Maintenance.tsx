const Maintenance = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 px-4">
      <div className="text-center p-8 sm:p-12 bg-background/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-border/20 max-w-lg">
        <h1 className="text-3xl sm:text-5xl font-bold text-primary-foreground mb-4">
          Under Maintenance
        </h1>
        <p className="text-lg sm:text-xl text-primary-foreground/80 mb-2">
          Lowest WePlay is temporarily closed.
        </p>
        <p className="text-primary-foreground/60">We&apos;ll be back soon.</p>
        <p className="text-primary-foreground/40 text-sm mt-8">
          All customer data is safe and preserved.
        </p>
      </div>
    </main>
  );
};

export default Maintenance;
