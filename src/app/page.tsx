import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section>
        <div>
          <h1>Welcome to the Next.js App!</h1>
          <p>This is a simple example of a Next.js application.</p>
          <Link href="/admin">Go to Admin Dashboard</Link>
        </div>
      </section>
    </main>
  );
}
