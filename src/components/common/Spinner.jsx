export default function Spinner({ size = 24 }) {
  return (
    <div
      className="border-3 border-navy-700 border-t-transparent rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  )
}