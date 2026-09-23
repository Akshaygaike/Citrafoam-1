import { redirect } from 'next/navigation';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q || '';
  if (q) {
    redirect(`/products?q=${encodeURIComponent(q)}`);
  }
  redirect('/products');
}
