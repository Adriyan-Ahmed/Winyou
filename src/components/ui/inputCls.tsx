export default function inputCls(error?: string) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm text-gray-200 placeholder-gray-600 bg-gray-900/50 outline-none transition-colors ${
    error
      ? "border-red-500/50 focus:border-red-500"
      : "border-gray-700 focus:border-indigo-500"
  }`;
}
