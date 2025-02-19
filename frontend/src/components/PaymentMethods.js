import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Plus, Trash2 } from 'lucide-react';

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [cards] = useState([
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '12/24',
      isDefault: true
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '8888',
      expiry: '06/25',
      isDefault: false
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="p-4 flex items-center gap-4">
          <ArrowLeft 
            className="w-6 h-6 text-gray-600 cursor-pointer" 
            onClick={() => navigate(-1)} 
          />
          <h1 className="text-xl font-semibold">Payment Methods</h1>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Saved Cards</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add New Card
              </button>
            </div>

            <div className="space-y-4">
              {cards.map(card => (
                <div key={card.id} className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {card.type === 'Visa' ? 'V' : 'M'}
                    </div>
                    <div>
                      <p className="font-medium">
                        {card.type} ending in {card.last4}
                        {card.isDefault && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">Expires {card.expiry}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  Save Address
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods ;