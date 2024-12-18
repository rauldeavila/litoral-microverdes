import React, { useState, useRef } from 'react'; // Import useRef
import { motion } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import styles from './Header.module.css';

const Header = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const inputRef = useRef(null); // Definindo o inputRef

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => inputRef.current?.focus(), 300); // Foca no input após a animação
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftMenu}>
        <a href="#produtos" className={styles.link}>
          Produtos
        </a>
        <a href="#quem-somos" className={styles.link}>
          Quem Somos
        </a>
      </div>
      <div className={styles.logoContainer}>
        <img src="/images/microgreens-logo.png" alt="Microgreens Shop" className={styles.logo} />
        <span className={styles.shopName}>Microgreens Shop</span>
      </div>
      <div className={styles.rightMenu}>
        <FaShoppingCart style={{ cursor: 'pointer', color: '#145018', fontSize: '18px' }} />
        <FaUser style={{ cursor: 'pointer', color: '#145018', fontSize: '18px' }} />
        <FaSearch
          onClick={toggleSearch}
          style={{ cursor: 'pointer', color: '#145018', fontSize: '18px' }}
        />
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: isSearchVisible ? 1 : 0, width: isSearchVisible ? '150px' : 0 }}
          transition={{ duration: 0.5 }}
          className={styles.searchInputContainer}
        >
          {isSearchVisible && (
            <input
              type="text"
              placeholder="Pesquisar"
              className={styles.searchInput}
              onBlur={toggleSearch}
            />
          )}
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
