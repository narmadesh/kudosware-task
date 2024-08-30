import { type InputHTMLAttributes } from "react";
export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label?: string;
	className?: string;
};
export default function Input({ className = '', name, label, id, ...props }:InputProps)
{
    return (
        <div className="flex flex-col gap-2">
          <label htmlFor={id}>{label}</label>
          <input {...props} name={name} id={id} className={"border-gray-200 border-2 p-2 rounded-sm " + className} />
        </div>
    )
}