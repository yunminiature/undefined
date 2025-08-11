export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to 2048</h1>
      <p className="max-w-2xl text-gray-600 mb-8">
        In a faraway digital realm, mysterious numbered tiles await. Your quest
        is to merge them, doubling their values, and reach the mythical 2048
        tile. Every move counts — plan wisely and don’t let the board fill up!
      </p>
      <img
        src="/preview.png"
        alt="2048 game preview"
        className="w-full max-w-xs rounded-md shadow-lg mb-8"
      />
      <a
        href="/game"
        className="inline-block bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition">
        Start Playing
      </a>
    </div>
  )
}
