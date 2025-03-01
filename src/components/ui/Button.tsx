import { ReactElement } from "react";

interface ButtonProps{
    variant: "positive"|"negative"|"primary"|"secondary";
    sizes:"sm"|"md"|"lg";
    onClick?:()=> void ;
    text:string|ReactElement
}

const variantStyles={

    "primary": "bg-purple-600 text-white hover:bg-purple-700",
    "secondary": "bg-purple-300 text-purple-600 hover:bg-purple-400",
    "positive": "bg-green-500 text-white hover:bg-green-600",
    "negative": "bg-red-500 text-white hover:bg-red-600",

}

const sizeStyles = {
    "sm": "px-2 py-1 text-sm",
    "md": "px-4 py-2 text-md",
    "lg": "px-6 py-3 text-lg",
  };   
  
const defaultStyle="rounded-md"


export const Button = (props: ButtonProps) => {

    return <button className={`${variantStyles[props.variant]} ${defaultStyle} ${sizeStyles[props.sizes]}`} onClick={props.onClick}> {props.text} </button>
}