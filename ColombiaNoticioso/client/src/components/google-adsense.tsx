import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/constants";

interface GoogleAdSenseProps {
  slot?: string;
  style?: React.CSSProperties;
  className?: string;
  format?: string;
  responsive?: boolean;
}

export function GoogleAdSense({ 
  slot, 
  style, 
  className = "",
  format = "auto",
  responsive = true 
}: GoogleAdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  // Don't render ads in development mode
  if (process.env.NODE_ENV === "development") {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}
        style={style}
      >
        <i className="fas fa-ad text-gray-400 text-3xl mb-2"></i>
        <p className="text-gray-500">Espacio publicitario - Google AdSense</p>
        <p className="text-xs text-gray-400 mt-1">{ADSENSE_CLIENT_ID}</p>
        {slot && <p className="text-xs text-gray-400">Slot: {slot}</p>}
      </div>
    );
  }

  return (
    <div ref={adRef} className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

// Predefined ad sizes for common placements
export function BannerAd({ className }: { className?: string }) {
  return (
    <GoogleAdSense
      slot="1234567890"
      className={className}
      style={{ width: "100%", height: "250px" }}
      format="rectangle"
    />
  );
}

export function SidebarAd({ className }: { className?: string }) {
  return (
    <GoogleAdSense
      slot="1234567891"
      className={className}
      style={{ width: "300px", height: "250px" }}
      format="rectangle"
    />
  );
}

export function MobileAd({ className }: { className?: string }) {
  return (
    <GoogleAdSense
      slot="1234567892"
      className={className}
      style={{ width: "320px", height: "100px" }}
      format="banner"
    />
  );
}

// Declare global adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
