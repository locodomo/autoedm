import React, { useState } from 'react';
import { Mail, ShoppingBag, User, Package } from 'lucide-react';
import OpenAI from 'openai';

interface FormData {
  customerName: string;
  favoriteCategory: string;
  recentPurchase: string;
}

interface CategoryContent {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const categories: CategoryContent[] = [
  {
    id: 'A',
    title: 'Category A - Electronics',
    description: 'Latest gadgets and tech accessories for the modern lifestyle.',
    icon: <ShoppingBag className="w-6 h-6" />
  },
  {
    id: 'B',
    title: 'Category B - Fashion',
    description: 'Trendy clothing and accessories to elevate your style.',
    icon: <User className="w-6 h-6" />
  },
  {
    id: 'C',
    title: 'Category C - Home & Garden',
    description: 'Everything you need to create your perfect living space.',
    icon: <Package className="w-6 h-6" />
  },
  {
    id: 'D',
    title: 'Category D - Sports & Outdoors',
    description: 'Gear and equipment for your active lifestyle and adventures.',
    icon: <ShoppingBag className="w-6 h-6" />
  }
];

function App() {
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    favoriteCategory: '',
    recentPurchase: ''
  });
  const [subjectLine, setSubjectLine] = useState('');
  const [bodyMessage, setBodyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateEmailCopy = async () => {
    if (!formData.favoriteCategory) {
      setError('Please select a favorite category');
      return;
    }

    setIsLoading(true);
    setError('');
    setSubjectLine('');
    setBodyMessage('');

    try {
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY || 'your-api-key-here',
        dangerouslyAllowBrowser: true
      });
      const selectedCategory = categories.find(cat => cat.id === formData.favoriteCategory);
      // 1. Generate subject line
      const subjectPrompt = `Generate a short, engaging subject line for a marketing email about ${selectedCategory?.title || formData.favoriteCategory}. Use an emoji. Do not include any other text.`;
      const subjectCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful marketing assistant.' },
          { role: 'user', content: subjectPrompt }
        ],
        max_tokens: 30,
        temperature: 0.8,
      });
      setSubjectLine(subjectCompletion.choices[0]?.message?.content?.replace(/^\s+|\s+$/g, '') || '');

      // 2. Generate body message
      const bodyPrompt = `Write a friendly, conversational marketing email body (excluding the subject line and greeting) for a customer named ${formData.customerName || 'there'} who loves ${selectedCategory?.title || formData.favoriteCategory}${formData.recentPurchase ? ` and recently purchased ${formData.recentPurchase}` : ''}. Reference the category and purchase naturally, but do not repeat the subject line or include a greeting. Make it sound personal and engaging. 2-4 sentences.`;
      const bodyCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful marketing assistant.' },
          { role: 'user', content: bodyPrompt }
        ],
        max_tokens: 120,
        temperature: 0.8,
      });
      setBodyMessage(bodyCompletion.choices[0]?.message?.content?.replace(/^\s+|\s+$/g, '') || '');
    } catch (err) {
      console.error('Error generating email copy:', err);
      setError('Failed to generate email copy. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryOrder = () => {
    if (!formData.favoriteCategory) return categories;
    const favorite = categories.find(cat => cat.id === formData.favoriteCategory);
    const others = categories.filter(cat => cat.id !== formData.favoriteCategory);
    return favorite ? [favorite, ...others] : categories;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">AutoEDM</h1>
          </div>
          <p className="text-gray-600">AI-Powered Personalized Email Content Generator</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label htmlFor="favoriteCategory" className="block text-sm font-medium text-gray-700 mb-2">
                Favorite Shopping Category *
              </label>
              <select
                id="favoriteCategory"
                name="favoriteCategory"
                value={formData.favoriteCategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                <option value="A">Category A - Electronics</option>
                <option value="B">Category B - Fashion</option>
                <option value="C">Category C - Home & Garden</option>
                <option value="D">Category D - Sports & Outdoors</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="recentPurchase" className="block text-sm font-medium text-gray-700 mb-2">
              Recent Purchase (Optional)
            </label>
            <input
              type="text"
              id="recentPurchase"
              name="recentPurchase"
              value={formData.recentPurchase}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="What did they recently purchase?"
            />
          </div>

          <div className="mt-6">
            <button
              onClick={generateEmailCopy}
              disabled={isLoading || !formData.favoriteCategory}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Generating...' : 'Generate Email Copy'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Email Preview */}
        {subjectLine && bodyMessage && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Email Preview</h2>
            <div className="max-w-2xl mx-auto">
              {/* Subject Line Display */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg mb-0">
                <div className="text-center">
                  <h3 className="text-lg font-bold">{subjectLine}</h3>
                </div>
              </div>
              {/* Email Card */}
              <div className="bg-white border border-gray-200 rounded-b-lg overflow-hidden shadow-xl">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-4 text-center">
                  <h4 className="font-bold text-lg">🛍️ Handpicked Picks for Your Next Upgrade</h4>
                </div>
                {/* Email Content */}
                <div className="p-8 space-y-6">
                  {/* Greeting */}
                  <div className="text-gray-800">
                    <p className="text-xl font-semibold">
                      Hi {formData.customerName || 'there'},
                    </p>
                  </div>
                  {/* Main Message */}
                  <div className="text-gray-700 leading-relaxed text-base">
                    <p>{bodyMessage}</p>
                  </div>
                  {/* Call to Action */}
                  <div className="text-center py-6">
                    <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 hover:shadow-xl">
                      👉 Shop New Arrivals
                    </button>
                    <p className="text-gray-500 text-sm mt-2">Limited time offer • Free shipping on orders over $50</p>
                  </div>
                  {/* Category Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getCategoryOrder().slice(0, 2).map((category) => (
                      <div
                        key={category.id}
                        className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                          category.id === formData.favoriteCategory
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center mb-3">
                          <div className={`p-2 rounded-full mr-3 ${
                            category.id === formData.favoriteCategory
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{category.title}</h3>
                            {category.id === formData.favoriteCategory && (
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mt-1">
                                ⭐ Your Favorite
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Footer */}
                  <div className="text-center pt-6 border-t border-gray-200">
                    <p className="text-gray-600 text-sm">
                      Thank you for shopping with us! Happy Shopping! 🎉
                    </p>
                  </div>
                </div>
              </div>
              {/* Copy Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    const emailContent = `Subject: ${subjectLine}\n\n🛍️ Handpicked Picks for Your Next Upgrade\n\nHi ${formData.customerName || 'there'},\n\n${bodyMessage}\n\n👉 Shop New Arrivals\nLimited time offer • Free shipping on orders over $50\n\nThank you for shopping with us! Happy Shopping! 🎉`;
                    navigator.clipboard.writeText(emailContent);
                    alert('Email content copied to clipboard!');
                  }}
                  className="bg-green-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-lg"
                >
                  📋 Copy Email Content
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
