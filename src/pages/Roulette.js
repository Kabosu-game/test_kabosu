import React, { useEffect, useRef, useState } from 'react'
import Levels from '../Components/Levels'
import SettingsMenu from '../Components/SettingsMenu'
import { RiArrowRightSLine, RiSettings4Fill } from 'react-icons/ri'
import { useUser } from '../context/userContext'
import Animate from '../Components/Animate'
import SlotMachine from '../Components/Slot'
import { PiInfoFill } from 'react-icons/pi'
import Exchanges from '../Components/Exchanges'
import { IoIosWarning } from "react-icons/io";
import { IoClose } from 'react-icons/io5'
import BalanceInfo from '../Components/BalanceInfo'

const Roulette = () => {
  const { userLevelss, tapBalance, fullName, balance, refBonus, openInfoThree, setOpenInfoThree, selectedExchange, selectedCharacter } = useUser();
  const [showLevel, setShowLevel] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [showExchange, setShowExchange] = useState(false);
  const infoRefThree = useRef(null);
  const [info, setInfo] = useState(false);


  const handleClickOutside = (event) => {
    if (infoRefThree.current && !infoRefThree.current.contains(event.target)) {
      setOpenInfoThree(false);
    }
  };

  useEffect(() => {
    if (openInfoThree) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line
  }, [openInfoThree]);


  const initialLevelIndex = userLevelss.findIndex(level => tapBalance < level.tapBalanceRequired);
  const currentLevelIndex = initialLevelIndex === -1 ? userLevelss.length - 1 : initialLevelIndex;

  const displayedLevelIndex = currentLevelIndex
  const currentLevel = userLevelss[displayedLevelIndex];

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };


  return (

    <Animate>

      <div className='w-full flex justify-center flex-col space-y-3'>
        {/* <Spinner /> */}
        <div className='w-full flex items-center space-x-[6px] px-5'>
          <div className='w-[30px] h-[30px] bg-cards rounded-[8px] p-[6px] overflow-hidden flex items-center justify-center relative'>
            <img src={selectedCharacter.avatar} className='w-[25px] mt-[6px]' alt={fullName || "user"} />

          </div>

          <h1 className='text-[11px] font-semibold'>
            {fullName} (CEO)
          </h1>

        </div>

        <div className='w-full flex justify-between items-center px-4 z-10 pb-[2px] pt-1'>

          <div className='w-[32%] flex flex-col space-y-1 pr-4'>

            <div className='w-full flex justify-between text-[10px] font-medium items-center'>

              <span className='levelName flex items-center'>
                <span onClick={() => setShowLevel(true)} className=''>{currentLevel.name}</span>
                <span className='flex items-center'>  <RiArrowRightSLine size={12} className='mt-[1px]' /> </span>
              </span>

              <span className=''>

                {currentLevel.id}/{userLevelss.length}


              </span>
            </div>

            <div className='flex w-full mt-2 items-center bg-[#56565630] rounded-[10px] border-[1px] border-[#49494952]'>


              <div className={`h-[6px] rounded-[8px] levelbar`} style={{ width: `${(tapBalance / currentLevel.tapBalanceRequired) * 100}%` }} />
            </div>

          </div>




          <div className='flex w-[60%] bg-[#5c5c5c52] border-[1px] border-[#434343] h-[40px] mb-[-4px] py-3 px-3 rounded-full items-center'>


            <button onClick={() => setShowExchange(true)} className=''>
              <img id={selectedExchange.id} src={selectedExchange.icon} alt={selectedExchange.name} className={`w-[22px]`} />
            </button>

            <div className='w-[1px] h-[18px] mx-[10px] bg-divider2' />
            <div className='flex flex-1 flex-col space-y-1 items-center justify-center'>
              <p className='text-[9px]'>
                Balance
              </p>
              <div className='flex items-center justify-center space-x-1 text-[11px]'>

                <span className='flex items-center justify-center'>
                  <img src='/coin.webp' alt='ppf' className='w-[12px]' />
                </span>
                <span className='font-bold'>
                  {formatNumber(balance + refBonus)}
                </span>
                <span className='flex items-center justify-center'>
                  <PiInfoFill onClick={() => setInfo(true)} size={14} className='text-info' />
                </span>

              </div>

            </div>

            <div className='w-[1px] h-[18px] mx-[10px] bg-divider2' />

            <button onClick={() => setShowSetting(true)} className=''>
              <RiSettings4Fill size={20} className='' />
            </button>

          </div>


        </div>


        <div className='w-full relative h-screen bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px]'>
          <div id="refer" className='w-full h-screen homescreen rounded-tl-[40px] rounded-tr-[40px] mt-[2px] px-5'>

            <div className='w-full flex flex-col scroller h-[80vh] overflow-y-auto pb-[150px]'>
              {/*  */}

              <div className='w-full flex justify-center items-center pt-6'>
                <h1 className='font-semibold text-[20px]'>
                  Lucky Spin & Win
                </h1>
              </div>

              <SlotMachine />


            </div>



          </div>





        </div>


        <Levels showLevel={showLevel} setShowLevel={setShowLevel} />
        <Exchanges showExchange={showExchange} setShowExchange={setShowExchange} />

        <SettingsMenu showSetting={showSetting} setShowSetting={setShowSetting} />
        <BalanceInfo info={info} setInfo={setInfo} />

      </div>


    </Animate>
  )
}

export default Roulette