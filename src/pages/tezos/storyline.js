import React, { useEffect, useRef, useState } from 'react';
import PageTransition from 'gatsby-plugin-page-transitions';

// CSS
// import '../assets/GameAssets/game.css';

// Components
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Zombie from 'src/components/GameComponents/Zombie';
import StoryTeller from 'src/components/GameComponents/Storyteller';

// Images
import Title from 'src/assets/GameAssets/title.svg';
import House from 'src/assets/GameAssets/house.svg';
import ForestLand from 'src/assets/GameAssets/forestland.svg';

// Custom styles and styled images
import Layout from 'src/components/Layout/layout';
import {
  MainContainer,
  Header,
  Footer,
  GameContainer,
  RightCloud,
  LeftCloud,
  BackLink,
} from 'src/PagesStyle/GamePage/styled';
import { useSpring, config } from 'react-spring';
import { getPlantId } from 'src/components/PlantGrowthModal/Plant';
import { LeftArrow, RightArrow } from '../../components/IconSet';
const Game = () => {
  const [plantType, setPlantTypeSeed] = useState(null);
  const [showStoryModal, setStoryModalDisplay] = useState(false);

  const gameContainer = useRef(null);
  const zombieRef = useRef(null);

  //generate plant type at random if not already have been
  useEffect(() => {
    getPlantId();
  });

  useEffect(() => {
    let plantType = null;
    const plantJSON =
      typeof window != 'undefined' && localStorage.getItem('plant');
    if (plantJSON !== null) {
      plantType = JSON.parse(plantJSON).type;
    }
    setPlantTypeSeed(plantType);

    for (let i = 0; i < 8; i++) {
      (function(i) {
        setTimeout(function() {
          createZombie(i);
        }, 4000 * i + 3000 / i);
      })(i);
    }
  }, []);

  const createZombie = zombieIndex => {
    if (!zombieRef.current || typeof zombieRef.current == 'undefined') return;
    let newZombie = zombieRef.current.cloneNode(true);
    newZombie.id = `zombie-${zombieIndex}`;
    newZombie.style.display = 'block';
    newZombie.classList.add('zombie');
    newZombie.classList.add('zombie-transition');
    newZombie.style.bottom = `${randomNumber(8, 12)}%`;
    gameContainer.current.appendChild(newZombie);
    moveZombie(newZombie);
  };

  const moveZombie = zombie => {
    let moveZombieInterval = setInterval(() => {
      let xPosition = parseInt(
        window.getComputedStyle(zombie).getPropertyValue('left'),
      );
      if (xPosition <= window.innerWidth / 1.5) {
        zombie.style.left = `${xPosition - 1}px`;
        setStoryModalDisplay(true);
        setTimeout(() => {
          clearInterval(moveZombieInterval);
          zombie.remove();
        }, 3500);
      } else {
        zombie.style.left = `${xPosition - 1}px`;
      }
    }, 20);
  };

  const randomNumber = (start, end) => Math.floor(Math.random() * end) + start;

  const props = useSpring({
    delay: 5000,
    config: { ...config.slow },
    from: {
      top: '0%',
      height: '100%',
    },
    to: async (next, cancel) => {
      await next({
        height: '80%',
        top: '10%',
      });
    },
  });

  const slideFromTop = useSpring({
    delay: 4000,
    config: { ...config.gentle },
    from: {
      height: '0%',
    },
    to: async (next, cancel) => {
      await next({
        height: '10%',
        zIndex: 200,
      });
    },
  });

  return (
    <PageTransition
      defaultStyle={{
        transition: 'opacity 3s ease-out',
        opacity: '0.4',
        background: '#000',
      }}
      transitionStyles={{
        entering: { opacity: '0.4' },
        entered: { opacity: '1' },
        exiting: { opacity: '0' },
      }}
      transitionTime={800}
    >
      <Layout background="#000">
        <MainContainer style={{ background: 'black' }}>
          <Header style={{ ...slideFromTop }}>
            <BackLink to={`/tezos/overview`}>
              <LeftArrow />
              <span>Back</span>
            </BackLink>
            <Title />
            <BackLink to={`/lesson/chapter-01`}>
              <span>Skip</span>
              <RightArrow />
            </BackLink>
          </Header>
          <GameContainer style={props} id="game-container" ref={gameContainer}>
            <StoryTeller display={showStoryModal} plantType={plantType} />
            <RightCloud />
            <LeftCloud />
            <div id="initialzombie" ref={zombieRef} style={{ display: 'none' }}>
              <Zombie />
            </div>
            <House className="house-img" />
            <ForestLand className="forest-land-img" />
          </GameContainer>
          <Footer style={{ ...slideFromTop }} />
        </MainContainer>
      </Layout>
    </PageTransition>
  );
};

export default Game;
