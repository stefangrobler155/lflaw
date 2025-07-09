export default function SuccessPage() {
  return (
    <main className="max-w-xl mx-auto py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">🎉 Contract Ready!</h1>
      <p className="mb-6">Thank you! Your document is downloading now.</p>
      <a href="/contracts" className="text-blue-600 underline">
        Back to all contracts
      </a>
    </main>
  );
}
