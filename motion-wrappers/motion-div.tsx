'use client';
import { motion, MotionProps } from 'framer-motion';

export const MotionDiv = ({
  children,
  className,
  initial,
  animate,
  variants,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  initial?: { opacity?: number; y?: number; x?: number };
  animate?: { opacity?: number; y?: number; x?: number };
  variants?: {
    hidden: { opacity?: number; y?: number; x?: number };
    show: { opacity?: number; y?: number; x?: number };
  };
  onClick?: React.MouseEventHandler<HTMLDivElement>;
} & MotionProps) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      className={className}
      onClick={onClick}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * A wrapper component for `motion.div` from Framer Motion.
 * This component applies initial and animate properties for animations
 * and accepts children to be rendered inside the motion div.
 *
 * @param children - The content to be rendered inside the motion div.
 * @param className - The Tailwind CSS class names to be applied to the motion div.
 * @param initial - The initial animation state with opacity and y-axis position.
 * @param animate - The animate state with opacity and y-axis position.
 * @param onClick - A click event handler for the motion div.
 * @param props - Additional props for `motion.div` (e.g., transition, exit, etc.).
 *
 * @example
 * ```tsx
 * <MotionDiv
 *   className="bg-blue-500 p-4"
 *   initial={{ opacity: 0, y: -10 }}
 *   animate={{ opacity: 1, y: 0 }}
 *   onClick={() => console.log('Clicked!')}
 * >
 *   <p>Hello, world!</p>
 * </MotionDiv>
 * ```
 */
