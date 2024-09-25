import React, { useEffect, useRef } from 'react';

const photos = [
  '/images/bia-1.jpg',
  '/images/bia-2.jpg',
  '/images/bia-3.jpg',
  '/images/bia-4.jpg',
  '/images/bia-5.jpg',
  '/images/bia-6.jpg',
  '/images/bia-7.jpg',
  '/images/bia-8.jpg',
  '/images/bia-9.jpg',
  '/images/bia-10.jpg',
  '/images/bia-11.jpg',
  '/images/bia-12.jpg',
  '/images/bia-13.jpg',
];

function Home() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollSpeed = 1; // Ajuste a velocidade do scroll
    let requestId;

    const scroll = () => {
      scrollContainer.scrollLeft += scrollSpeed;
      // Reinicia o scroll para o começo quando chega ao final
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }
      requestId = requestAnimationFrame(scroll);
    };

    scroll();

    return () => cancelAnimationFrame(requestId);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Em breve essa será a página do Litoral Microverdes</h1>
      <div style={styles.scrollWrapper} ref={scrollRef}>
        <div style={styles.scrollContent}>
          {/* Duplicamos o array de fotos para criar o efeito infinito */}
          {photos.concat(photos).map((photo, index) => (
            <div key={index} style={styles.imageContainer}>
              <img src={photo} alt={`Bia ${index + 1}`} style={styles.image} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#EFE9CE',
    color: '#145018',
    textAlign: 'center',
    overflowX: 'hidden', // Esconde a barra de rolagem horizontal
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
  },
  scrollWrapper: {
    display: 'flex',
    overflow: 'hidden',
    width: '100vw', // Ocupa toda a largura da viewport
    maxWidth: '100%',
    margin: '0 -20px', // Alinha com as bordas do navegador
  },
  scrollContent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
  },
  imageContainer: {
    flexShrink: 0,
    padding: '0 5px', // Pequeno espaço entre as fotos
  },
  image: {
    height: '150px',
    width: 'auto', // Mantém o aspecto original
    borderRadius: '8px',
  },
};

export default Home;