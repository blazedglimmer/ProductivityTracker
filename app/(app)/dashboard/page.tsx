import { Dashboard } from '@/components/sections/dashboard';
import { getCategories } from '@/lib/actions/time-entries';

export default async function DashboardPage() {
  const categories = await loadCategories();
  return <Dashboard categories={categories ?? []} />;
}

const loadCategories = async () => {
  try {
    const result = await getCategories();
    return result;
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};
