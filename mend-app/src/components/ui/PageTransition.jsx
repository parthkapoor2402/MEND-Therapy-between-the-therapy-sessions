import { motion } from 'framer-motion'

export default function PageTransition({ children, className, ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
