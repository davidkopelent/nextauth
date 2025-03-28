import clsx from 'clsx';
import { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
        placeholder?: string;
}

export function Input({ className, placeholder, ...rest }: InputProps) {
        const [isFocused, setIsFocused] = useState(false);

        return (
                <div
                        className={clsx(
                                'relative block w-full',
                                className
                        )}
                >
                        <input
                                className={clsx(
                                        'block w-full rounded-2xl border border-slate-200 p-4 text-base text-slate-800 transition-all placeholder-transparent',
                                        isFocused && 'border-black', // Adjust border color on focus
                                )}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={placeholder} // Original placeholder for the input
                                {...rest}
                        />
                        <label
                                className={clsx(
                                        'absolute left-4 top-4 transition-all text-slate-300 pointer-events-none',
                                        isFocused || rest.value ? 'text-xs -top-2' : ''
                                )}
                        >
                                {placeholder}
                        </label>
                </div>
        );
}