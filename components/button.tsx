import { type ButtonHTMLAttributes } from "react";
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  type?: string;
  className?: string;
  variant?: string;
};
export default function Button({ className = '', variant, type = 'button', children, ...props }: ButtonProps) {
  return (
    <button {...props} className={className + " py-2 px-4 text-white rounded-lg " + (variant == "danger" ? "bg-flamingo-700 hover:bg-flamingo-500" : (variant == "info" ? "bg-blue-900 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-700"))} type={type}>{children}</button>
  )
}