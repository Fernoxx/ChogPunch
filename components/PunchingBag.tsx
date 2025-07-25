import { ChogAnim } from "./Chog"

interface Props {
  anim: ChogAnim
}

export default function PunchingBag({ anim }: Props) {
  return (
    <div className="absolute right-12 top-16 w-32 h-96 select-none">
      {/* Heavy Chain */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-20 z-10">
        <div className="w-full h-full relative">
          {/* Individual Chain Links */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-4 border-2 border-gray-600 bg-gray-500 rounded-full"></div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-4 border-2 border-gray-700 bg-gray-600 rounded-full"></div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-4 border-2 border-gray-600 bg-gray-500 rounded-full"></div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-3 h-4 border-2 border-gray-700 bg-gray-600 rounded-full"></div>
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-4 border-2 border-gray-600 bg-gray-500 rounded-full"></div>
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-3 h-4 border-2 border-gray-700 bg-gray-600 rounded-full"></div>
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-3 h-4 border-2 border-gray-600 bg-gray-500 rounded-full"></div>
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-3 h-4 border-2 border-gray-700 bg-gray-600 rounded-full"></div>
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-3 h-4 border-2 border-gray-600 bg-gray-500 rounded-full"></div>
        </div>
      </div>

      {/* Ceiling Mount */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg border-2 border-gray-800 shadow-xl"></div>

      {/* Heavy Bag */}
      <div className={`relative mt-16 transition-all duration-300 transform-gpu ${
        anim === "idle" || anim === "gasping" || anim === "homeAnimation" ? "animate-sway-bag" :
        anim === "punch" ? "animate-punch-impact" :
        anim === "kick" ? "animate-kick-impact" :
        anim === "push" ? "animate-push-impact" : ""
      }`}>
        
        {/* Top Cap */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-b from-black to-gray-800 rounded-t-2xl border-4 border-gray-900 shadow-2xl">
          {/* Chain Attachment Point */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-600 rounded-full border border-gray-800"></div>
          {/* Metal Ring */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full"></div>
        </div>

        {/* Main Bag Body */}
        <div className="relative w-28 h-64 mx-auto bg-gradient-to-b from-red-600 via-red-700 to-red-800 rounded-2xl shadow-2xl border-4 border-red-900">
          
          {/* Leather Texture & Stitching */}
          <div className="absolute inset-1 rounded-xl">
            {/* Horizontal Stitching Lines */}
            <div className="absolute top-8 left-2 right-2 h-0.5 bg-red-900 opacity-80"></div>
            <div className="absolute top-16 left-2 right-2 h-0.5 bg-red-900 opacity-80"></div>
            <div className="absolute top-24 left-2 right-2 h-0.5 bg-red-900 opacity-80"></div>
            <div className="absolute top-32 left-2 right-2 h-0.5 bg-red-900 opacity-80"></div>
            <div className="absolute top-40 left-2 right-2 h-0.5 bg-red-900 opacity-80"></div>
            <div className="absolute top-48 left-2 right-2 h-0.5 bg-red-900 opacity-80"></div>
            <div className="absolute top-56 left-2 right-2 h-0.5 bg-red-900 opacity-80"></div>

            {/* Vertical Stitching */}
            <div className="absolute top-4 bottom-4 left-2 w-0.5 bg-red-900 opacity-90"></div>
            <div className="absolute top-4 bottom-4 right-2 w-0.5 bg-red-900 opacity-90"></div>
            <div className="absolute top-4 bottom-4 left-1/2 transform -translate-x-1/2 w-0.5 bg-red-900 opacity-60"></div>

            {/* Leather Patches */}
            <div className="absolute top-6 left-4 w-6 h-8 bg-red-800 rounded opacity-40"></div>
            <div className="absolute top-20 right-4 w-6 h-8 bg-red-800 rounded opacity-40"></div>
            <div className="absolute top-34 left-4 w-6 h-8 bg-red-800 rounded opacity-40"></div>
            <div className="absolute top-48 right-4 w-6 h-8 bg-red-800 rounded opacity-40"></div>
          </div>

          {/* Main Highlight */}
          <div className="absolute top-8 left-4 w-6 h-16 bg-gradient-to-br from-red-400 to-transparent rounded-2xl opacity-70"></div>
          
          {/* Secondary Highlight */}
          <div className="absolute top-12 left-6 w-3 h-8 bg-gradient-to-br from-red-300 to-transparent rounded-xl opacity-50"></div>

          {/* Impact Effect Overlay */}
          <div className={`absolute inset-0 rounded-2xl transition-all duration-150 ${
            anim === "punch" || anim === "kick" || anim === "push" 
              ? "bg-white opacity-30 scale-105" 
              : "opacity-0"
          }`}></div>

          {/* Impact Ripple Effect */}
          {(anim === "punch" || anim === "kick" || anim === "push") && (
            <>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-white rounded-full opacity-60 animate-ping"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-white rounded-full opacity-40 animate-ping delay-75"></div>
            </>
          )}

          {/* Dust/Debris Effects */}
          {(anim === "punch" || anim === "kick" || anim === "push") && (
            <>
              <div className="absolute top-6 left-4 w-1 h-1 bg-yellow-200 rounded-full opacity-80 animate-bounce"></div>
              <div className="absolute top-8 right-6 w-1 h-1 bg-yellow-200 rounded-full opacity-80 animate-bounce delay-100"></div>
              <div className="absolute top-12 left-8 w-1 h-1 bg-yellow-200 rounded-full opacity-80 animate-bounce delay-200"></div>
              <div className="absolute top-20 right-4 w-1 h-1 bg-yellow-200 rounded-full opacity-80 animate-bounce delay-300"></div>
            </>
          )}

          {/* Sweat/Moisture Drops */}
          {(anim === "punch" || anim === "kick" || anim === "push") && (
            <>
              <div className="absolute top-10 left-6 w-1 h-3 bg-blue-300 rounded-full opacity-70 animate-bounce"></div>
              <div className="absolute top-16 right-8 w-1 h-3 bg-blue-300 rounded-full opacity-70 animate-bounce delay-150"></div>
              <div className="absolute top-24 left-10 w-1 h-3 bg-blue-300 rounded-full opacity-70 animate-bounce delay-300"></div>
            </>
          )}
        </div>

        {/* Bottom Weight */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-gradient-to-b from-gray-800 to-black rounded-b-2xl border-4 border-gray-900 shadow-2xl">
          {/* Weight Texture */}
          <div className="absolute inset-1 bg-gradient-to-b from-gray-700 to-gray-900 rounded-b-xl"></div>
          <div className="absolute top-1 left-2 right-2 h-0.5 bg-gray-600 opacity-60"></div>
          <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-black opacity-80"></div>
        </div>

        {/* Shadow on Ground */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-black opacity-20 rounded-full blur-sm"></div>

      </div>
    </div>
  )
}
