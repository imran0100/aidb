'use client';

import { useChat } from '@ai-sdk/react';
import {marked} from 'marked'
export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
console.log(messages,"messages");
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role !== 'user' && (
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-2">
                🤖
              </div>
            )}
            <div
              className={`p-3 rounded-lg max-w-lg ${
                message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center ml-2">
                😊
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Form Section */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-4 bg-white border-t border-gray-300"
      >
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="w-3/4 ml-12 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}