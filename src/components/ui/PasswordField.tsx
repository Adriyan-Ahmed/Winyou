import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordField({
  label,
  name,
  value,
  onChange,
  show,
  toggle,
}: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </label>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2.5 pl-9 pr-10 rounded-xl border border-gray-700 text-sm text-gray-200 bg-gray-900/50 outline-none focus:border-indigo-500"
          placeholder="Enter password"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
