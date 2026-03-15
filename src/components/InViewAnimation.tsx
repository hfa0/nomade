import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'motion/react';

const InViewAnimation = ({
  children,
  className,
  id,
}: {
  id?: string;
  className?: string;
  children?: ReactNode;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default InViewAnimation;
