import { ChogAnim } from "./Chog"

interface Props {
  anim: ChogAnim
}

export default function PunchingBag({ anim }: Props) {
  return (
    <div className="absolute right-12 top-20 w-32 h-80 select-none">
      {/* Chain */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-16 z-10">
        <div className="w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-lg"
             style={{
               background: "repeating-linear-gradient(0deg, #666 0px, #666 4px, #444 4px, #444 8px)"
             }}
        />
      </div>

      {/* Punching Bag */}
      <div className={`relative mt-12 transition-all duration-300 transform-gpu ${
        anim === "idle" || anim === "gasping" || anim === "homeAnimation" ? "animate-sway-bag" :
        anim === "punch" ? "animate-punch-impact" :
        anim === "kick" ? "animate-kick-impact" :
        anim === "push" ? "animate-push-impact" : ""
      }`}>
        {/* Main bag body - Red leather look */}
        <div className="relative w-28 h-48 mx-auto bg-gradient-to-b from-red-500 via-red-600 to-red-700 rounded-lg shadow-2xl border-2 border-red-800">
          {/* Leather texture lines */}
          <div className="absolute top-8 left-2 right-2 h-0.5 bg-red-800 opacity-60"></div>
          <div className="absolute top-16 left-2 right-2 h-0.5 bg-red-800 opacity-60"></div>
          <div className="absolute top-24 left-2 right-2 h-0.5 bg-red-800 opacity-60"></div>
          <div className="absolute top-32 left-2 right-2 h-0.5 bg-red-800 opacity-60"></div>
          <div className="absolute top-40 left-2 right-2 h-0.5 bg-red-800 opacity-60"></div>

          {/* Side stitching */}
          <div className="absolute top-4 bottom-4 left-1 w-0.5 bg-red-900 opacity-80"></div>
          <div className="absolute top-4 bottom-4 right-1 w-0.5 bg-red-900 opacity-80"></div>

          {/* Top cap */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gradient-to-b from-black to-gray-800 rounded-t-full border-2 border-gray-900">
            {/* Chain attachment */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>

          {/* Bottom weight */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gradient-to-b from-gray-800 to-black rounded-b-full border-2 border-gray-900"></div>

          {/* Impact effect overlay */}
          <div className={`absolute inset-0 rounded-lg transition-opacity duration-150 ${
            anim === "punch" || anim === "kick" || anim === "push" 
              ? "bg-white opacity-20" 
              : "opacity-0"
          }`}></div>

          {/* Sweat drops when being hit */}
          {(anim === "punch" || anim === "kick" || anim === "push") && (
            <>
              <div className="absolute top-6 left-4 w-1 h-2 bg-blue-300 rounded-full opacity-80 animate-bounce"></div>
              <div className="absolute top-8 right-6 w-1 h-2 bg-blue-300 rounded-full opacity-80 animate-bounce delay-100"></div>
              <div className="absolute top-12 left-8 w-1 h-2 bg-blue-300 rounded-full opacity-80 animate-bounce delay-200"></div>
            </>
          )}

          {/* Highlight on the bag */}
          <div className="absolute top-6 left-6 w-4 h-8 bg-gradient-to-br from-red-300 to-transparent rounded-full opacity-60"></div>
        </div>
      </div>
    </div>
  )
}
