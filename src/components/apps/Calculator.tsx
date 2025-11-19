import React, { useState } from 'react';
import clsx from 'clsx';

const Calculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);

    const handleNumber = (num: string) => {
        if (waitingForNewValue) {
            setDisplay(num);
            setWaitingForNewValue(false);
        } else {
            setDisplay(display === '0' ? num : display + num);
        }
    };

    const handleOperator = (op: string) => {
        const currentValue = parseFloat(display);

        if (prevValue === null) {
            setPrevValue(currentValue);
        } else if (operator) {
            const result = calculate(prevValue, currentValue, operator);
            setPrevValue(result);
            setDisplay(String(result));
        }

        setWaitingForNewValue(true);
        setOperator(op);
    };

    const calculate = (a: number, b: number, op: string) => {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '×': return a * b;
            case '÷': return a / b;
            default: return b;
        }
    };

    const handleEqual = () => {
        if (operator && prevValue !== null) {
            const currentValue = parseFloat(display);
            const result = calculate(prevValue, currentValue, operator);
            setDisplay(String(result));
            setPrevValue(null);
            setOperator(null);
            setWaitingForNewValue(true);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
    };

    const buttons = [
        { label: 'C', onClick: handleClear, className: 'bg-red-500 hover:bg-red-600 text-white' },
        { label: '±', onClick: () => setDisplay(String(parseFloat(display) * -1)), className: 'bg-gray-300 dark:bg-gray-400 hover:bg-gray-400 dark:hover:bg-gray-500 text-black' },
        { label: '%', onClick: () => setDisplay(String(parseFloat(display) / 100)), className: 'bg-gray-300 dark:bg-gray-400 hover:bg-gray-400 dark:hover:bg-gray-500 text-black' },
        { label: '÷', onClick: () => handleOperator('÷'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
        { label: '7', onClick: () => handleNumber('7'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white' },
        { label: '8', onClick: () => handleNumber('8'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white' },
        { label: '9', onClick: () => handleNumber('9'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white' },
        { label: '×', onClick: () => handleOperator('×'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
        { label: '4', onClick: () => handleNumber('4'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white' },
        { label: '5', onClick: () => handleNumber('5'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white' },
        { label: '6', onClick: () => handleNumber('6'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white' },
        { label: '-', onClick: () => handleOperator('-'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
        { label: '1', onClick: () => handleNumber('1'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white' },
        { label: '2', onClick: () => handleNumber('2'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white' },
        { label: '3', onClick: () => handleNumber('3'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white' },
        { label: '+', onClick: () => handleOperator('+'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
        { label: '0', onClick: () => handleNumber('0'), className: 'col-span-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white rounded-l-full pl-6 text-left' },
        { label: '.', onClick: () => handleNumber('.'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white' },
        { label: '=', onClick: handleEqual, className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    ];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black p-4 transition-colors">
            <div className="flex-1 flex items-end justify-end text-black dark:text-white text-5xl font-light mb-4 truncate">
                {display}
            </div>
            <div className="grid grid-cols-4 gap-3 h-4/5">
                {buttons.map((btn, i) => (
                    <button
                        key={i}
                        className={clsx(
                            "rounded-full text-xl font-medium transition-colors flex items-center justify-center select-none active:scale-95",
                            btn.className,
                            btn.label === '0' ? "pl-6 justify-start" : ""
                        )}
                        onClick={btn.onClick}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calculator;
