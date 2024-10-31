'use client';

import Link from 'next/link';
import SampleProject from './SampleProject';
import { useState } from 'react';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGetStarted = () => {
    const sampleProjectComponent = document.getElementById('sample-project');
    if (sampleProjectComponent) {
      sampleProjectComponent.querySelector('button')?.click();
    }
  };

  const handleButtonClick = () => {
    if (isLoggedIn) {
      handleGetStarted();
    } else {
      window.location.href = '/auth/signup';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-24">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
          Turn Your SaaS Ideas into Reality in Days, Not Months
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Skip the endless planning. Our AI-powered platform helps founders build production-ready SaaS applications faster than ever
        </p>
        <button
          onClick={handleButtonClick}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Get Started
        </button>
        <Link
          href="/auth/signin"
          className="ml-4 inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign In
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-12 mb-24">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4">Launch Faster with AI</h2>
          <p className="text-gray-600">
            Stop wrestling with architecture decisions. Our AI assistant guides you through proven patterns to get your SaaS off the ground in record time.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4">Built for Scale</h2>
          <p className="text-gray-600">
            Start with a rock-solid foundation using Next.js 14 and Tailwind. Your app will be blazing fast and ready to grow with your business.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-4">Delight Your Users</h2>
          <p className="text-gray-600">
            Build what your customers actually want. Integrated feedback tools help you collect, prioritize, and act on user insights.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-12 mb-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Your Journey to Launch</h2>
        <div className="grid md:grid-cols-4 gap-12">
          <div className="text-center">
            <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-semibold">
              1
            </div>
            <h3 className="text-lg font-semibold mb-3">Share Your Vision</h3>
            <p className="text-gray-600 leading-relaxed">Tell us what success looks like for your SaaS project</p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-semibold">
              2
            </div>
            <h3 className="text-lg font-semibold mb-3">Get Your Roadmap</h3>
            <p className="text-gray-600 leading-relaxed">Our AI creates a custom plan tailored to your business goals</p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-semibold">
              3
            </div>
            <h3 className="text-lg font-semibold mb-3">Build with Confidence</h3>
            <p className="text-gray-600 leading-relaxed">Start with a production-ready codebase that follows best practices</p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-semibold">
              4
            </div>
            <h3 className="text-lg font-semibold mb-3">Grow & Optimize</h3>
            <p className="text-gray-600 leading-relaxed">Use data-driven insights to evolve your product</p>
          </div>
        </div>
      </div>
    </div>
  );
} 