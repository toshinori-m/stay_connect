export default function MouseCharacter() {
  return (
    <div className="animate-bounce">
      <svg className="h-12 w-12 md:-mt-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* ネズミの本体 */}
        <circle cx="50" cy="50" r="40" fill="#38BDF8" />

        {/* ネズミの耳 */}
        <circle cx="22" cy="30" r="12" fill="#38BDF8" />
        <circle cx="22" cy="30" r="6" fill="#FFF" />
        <circle cx="78" cy="30" r="12" fill="#38BDF8" />
        <circle cx="78" cy="30" r="6" fill="#FFF" />

        {/* ネズミの目 */}
        <circle cx="35" cy="50" r="5" fill="#000" />
        <circle cx="65" cy="50" r="5" fill="#000" />

        {/* ネズミの鼻 */}
        <circle cx="50" cy="60" r="3" fill="#F00" />

        {/* ネズミのほっぺ */}
        <circle cx="32" cy="65" r="4" fill="#FAB" />
        <circle cx="68" cy="65" r="4" fill="#FAB" />

        {/* ネズミのしっぽ */}
        <path d="M 75,75 q 15,-10 25,5" stroke="#38BDF8" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}
