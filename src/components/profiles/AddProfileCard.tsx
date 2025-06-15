
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddProfileCard: React.FC<{ variants: any }> = ({ variants }) => {
  const navigate = useNavigate();

  return (
    <motion.div variants={variants}>
      <button 
        onClick={() => navigate('/create-profile')}
        className="w-full h-full rounded-2xl border-2 border-dashed border-white/30 hover:border-wonderwhiz-pink hover:bg-white/5 flex flex-col items-center justify-center py-16 transition-all duration-300"
      >
        <motion.div 
          className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4"
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            backgroundColor: 'rgba(255,255,255,0.2)'
          }}
        >
          <UserPlus className="h-10 w-10 text-white/70" />
        </motion.div>
        <span className="text-white text-xl font-medium font-baloo">Add New Profile</span>
      </button>
    </motion.div>
  );
};

export default AddProfileCard;
