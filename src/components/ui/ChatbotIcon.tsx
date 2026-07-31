"use client";

interface Props {
  size?: number;
}

// Lightweight SVG bot icon replacing 826KB @lottiefiles/dotlottie-react
const ChatbotIcon = ({ size = 28 }: Props) => {
  return (
    <div className="rounded-full flex items-center justify-center shadow">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Bot head */}
        <rect x="10" y="16" width="44" height="32" rx="10" fill="#fff" opacity="0.95" />
        {/* Antenna */}
        <line x1="32" y1="16" x2="32" y2="8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="6" r="3" fill="#DE802B" />
        {/* Eyes */}
        <circle cx="22" cy="30" r="4" fill="#134698" />
        <circle cx="42" cy="30" r="4" fill="#134698" />
        <circle cx="23" cy="29" r="1.5" fill="#fff" />
        <circle cx="43" cy="29" r="1.5" fill="#fff" />
        {/* Mouth */}
        <path d="M24 38 Q32 44 40 38" stroke="#134698" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Ears */}
        <rect x="5" y="26" width="5" height="12" rx="2.5" fill="#fff" opacity="0.7" />
        <rect x="54" y="26" width="5" height="12" rx="2.5" fill="#fff" opacity="0.7" />
      </svg>
    </div>
  );
};

export default ChatbotIcon;