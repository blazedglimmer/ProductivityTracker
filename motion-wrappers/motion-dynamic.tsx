// 'use client';
// import { motion, HTMLMotionProps } from 'framer-motion';
// import React from 'react';

// // Define a type for valid HTML tags supported by Framer Motion
// type ValidMotionTags = keyof typeof motion;

// export const MotionComponent = <T extends ValidMotionTags>({
//   children,
//   className,
//   initial,
//   animate,
//   onClick,
//   as, // Dynamic tag (e.g., 'div', 'nav', 'section', etc.)
//   ...props
// }: {
//   children: React.ReactNode;
//   className: string;
//   initial: { opacity?: number; y?: number; x?: number };
//   animate: { opacity?: number; y?: number; x?: number };
//   variant?: {
//     hidden: { opacity?: number; y?: number; x?: number };
//     show: { opacity?: number; y?: number; x?: number };
//   };
//   onClick?: React.MouseEventHandler<HTMLElement>;
//   as: T; // Dynamic tag passed as a prop
// } & HTMLMotionProps<T>) => {
//   // Create the motion component dynamically
//   const MotionElement = motion[as] as React.FC<HTMLMotionProps<T>>;

//   return (
//     <MotionElement
//       initial={initial}
//       animate={animate}
//       className={className}
//       onClick={onClick}
//       {...props}
//     >
//       {children}
//     </MotionElement>
//   );
// };

/**
 * A flexible wrapper component for Framer Motion.
 * This component allows you to dynamically specify the HTML tag (e.g., 'div', 'nav', 'section').
 *
 * @param children - The content to be rendered inside the motion element.
 * @param className - The Tailwind CSS class names to be applied to the motion element.
 * @param initial - The initial animation state with opacity and y-axis position.
 * @param animate - The animate state with opacity and y-axis position.
 * @param variant - Optional variant states for hidden/show animations.
 * @param onClick - A click event handler for the motion element.
 * @param as - The HTML tag to render (e.g., 'div', 'nav', 'section').
 * @param props - Additional props for the motion element (e.g., transition, exit, etc.).
 *
 * @example
 * ```tsx
 * <MotionComponent
 *   as="div" // Render as a div
 *   className="bg-blue-500 p-4"
 *   initial={{ opacity: 0, y: -10 }}
 *   animate={{ opacity: 1, y: 0 }}
 *   onClick={() => console.log('Clicked!')}
 * >
 *   <p>Hello, world!</p>
 * </MotionComponent>
 * ```
 */
