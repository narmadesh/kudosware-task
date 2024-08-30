import { SelectHTMLAttributes, type InputHTMLAttributes } from "react";
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
  label?: string;
  className?: string;
};
export default function Select({ className = '', name, label, children, id, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>{label}</label>
      <select {...props} name={name} id={id} className={"border-gray-200 border-2 p-2 rounded-sm " + className}>{children}</select>
    </div>
  )
}