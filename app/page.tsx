'use server';

import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-6">Welcome to Product Tracker</h1>
        <p className="text-lg mb-4">
          Track your products efficiently and effortlessly.
        </p>
        <Link href="/timer">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Get Started
          </button>
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <Image
            src="/images/feature1.png"
            alt="Feature 1"
            className="w-32 h-32 mb-4"
            width={128}
            height={128}
          />
          <h2 className="text-2xl font-semibold mb-2">Feature 1</h2>
          <p className="text-center">
            Description of feature 1 that highlights its benefits and usage.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/images/feature2.png"
            alt="Feature 2"
            className="w-32 h-32 mb-4"
            width={128}
            height={128}
          />
          <h2 className="text-2xl font-semibold mb-2">Feature 2</h2>
          <p className="text-center">
            Description of feature 2 that highlights its benefits and usage.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/images/feature3.png"
            alt="Feature 3"
            className="w-32 h-32 mb-4"
            width={128}
            height={128}
          />
          <h2 className="text-2xl font-semibold mb-2">Feature 3</h2>
          <p className="text-center">
            Description of feature 3 that highlights its benefits and usage.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/images/feature4.png"
            alt="Feature 4"
            className="w-32 h-32 mb-4"
            width={128}
            height={128}
          />
          <h2 className="text-2xl font-semibold mb-2">Feature 4</h2>
          <p className="text-center">
            Description of feature 4 that highlights its benefits and usage.
          </p>
        </div>
      </div>
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
        <p className="text-lg mb-6">
          We provide the best tools to track your products with ease and
          efficiency.
        </p>
        <button className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600">
          Learn More
        </button>
      </div>
    </div>
  );
}
