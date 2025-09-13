import { motion } from 'framer-motion';

interface AnimatedBulletListProps {
  items: string[];
}

export default function AnimatedBulletList({ items }: AnimatedBulletListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start"
        >
          <span className="mr-2">•</span>
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}
