import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firestore'; // Adjust the path as needed
import { useLocation } from 'react-router-dom';
import { images } from '../constants';
import { friendsRewards } from '../constants';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);


const userLevelss = [
  { id: 1, name: 'Bronze', icon: '/bronze.png', tapBalanceRequired: 1000000 },
  { id: 2, name: 'Silver', icon: '/silver.png', tapBalanceRequired: 10000000 },
  { id: 3, name: 'Gold', icon: '/gold.png', tapBalanceRequired: 100000000 },
  { id: 4, name: 'Platinum', icon: '/platinum.png', tapBalanceRequired: 1000000000 },
  { id: 5, name: 'Diamond', icon: '/diamond.png', tapBalanceRequired: 2500000000 },
  { id: 6, name: 'Master', icon: '/master.png', tapBalanceRequired: 10000000000 },
];


const prTeam = [
  {
    title: 'WUUW DRC20',
    level: [
      { level: 1, profit: 100, cost: 1000 },
      { level: 2, profit: 200, cost: 5000 },
      { level: 3, profit: 300, cost: 20000 },
      { level: 4, profit: 400, cost: 21000 },
    ],
    totalProfit: 0,
    icon: '/wwuw.png',
    description: 'Be Part of the pioneers of Drc20 ecosytem on Dogecoin | 21 000 000 Max Supply | Website : https://linktr.ee/WinanceExchange'
  },
  {
    title: 'PUMP DRC20',
    level: [
      { level: 1, profit: 100, cost: 1000 },
      { level: 2, profit: 200, cost: 5000 },
      { level: 3, profit: 300, cost: 20000 },
      { level: 4, profit: 400, cost: 100000 },
    ],
    totalProfit: 0,
    icon: '/pump.png',
    description: 'PUMP DRC20, soon nft collection with great utility ( Dogecoin mining ) | 1 000 000 Max Supply | Website : drc20pump.com'

  },
  {
    title: 'DGDG DRC20',
    level: [
      { level: 1, profit: 240, cost: 2000 },
      { level: 2, profit: 480, cost: 10000 },
      { level: 3, profit: 960, cost: 100000 },
      { level: 4, profit: 1264, cost: 400000 },
    ],
    totalProfit: 0,
    icon: '/dgdg.png',
    description: '[ $DOGE + $DOGI = $DGDG ], Total supply : 21,000,000,000,000,000 | Website : dogidogi.dog'
  },
  {
    title: 'IPWT DRC20',
    level: [
      { level: 1, profit: 70, cost: 750 },
      { level: 2, profit: 140, cost: 1400 },
      { level: 3, profit: 280, cost: 6600 },
      { level: 4, profit: 560, cost: 10000 },
    ],
    totalProfit: 0,
    icon: '/ipwt.png',
    description: 'Trust Pepe ideology , In Pepe We Trust. | 20 000 000 Max Supply | Website : hub.xyz/ipwt'
  },
  {
    title: 'LTDG DRC20',
    level: [
      { level: 1, profit: 75, cost: 550 },
      { level: 2, profit: 140, cost: 1000 },
      { level: 3, profit: 200, cost: 4000 },
      { level: 4, profit: 400, cost: 8000 },
    ],
    totalProfit: 0,
    icon: '/ltdg.png',
    description: 'We Learn, WE Build, We Educate a resource for Doing Only Good Everyday | 8 400 000 Max Supply | Website : litedogedrc.dog'
  },
  {
    title: 'DNLD DRC20',
    level: [
      { level: 1, profit: 90, cost: 1000 },
      { level: 2, profit: 180, cost: 4000 },
      { level: 3, profit: 360, cost: 12000 },
      { level: 4, profit: 720, cost: 24000 },
    ],
    totalProfit: 0,
    icon: '/dnld.png',
    description: 'The Leading Trump Token on Doge | 11 052 024 | Website : doginaldtrump.com'
  },
  {
    title: 'WUFI DRC20',
    level: [
      { level: 1, profit: 90, cost: 1000 },
      { level: 2, profit: 180, cost: 4000 },
      { level: 3, profit: 360, cost: 12000 },
      { level: 4, profit: 720, cost: 24000 },
    ],
    totalProfit: 0,
    icon: '/wufi.png',
    description: 'First Dex on DRC20 & Doge Building DogFi | 10 000 000 Max Supply | Website : bento.me/wufiswap'
  },
  {
    title: 'ARMZ DRC20',
    level: [
      { level: 1, profit: 90, cost: 1000 },
      { level: 2, profit: 180, cost: 4000 },
      { level: 3, profit: 360, cost: 12000 },
      { level: 4, profit: 720, cost: 24000 },
    ],
    totalProfit: 0,
    icon: '/ARMZ DRC20.jpg',
    description: 'The Bank Of Armz | NFT Bank Notes l DRC 20 Airdrop Tool | 3 130 000  Max Supply | Website : bankofarmz.com'
  },
  {
    title: 'OBOB DRC20',
    level: [
      { level: 1, profit: 90, cost: 1000 },
      { level: 2, profit: 180, cost: 4000 },
      { level: 3, profit: 360, cost: 12000 },
      { level: 4, profit: 720, cost: 24000 },
    ],
    totalProfit: 0,
    icon: '/OBOB DRC20.png',
    description: '21,000,000 Green Frog called OBOB traveling on the Dogecoin blockchain.'
  },
]
const marketTeam = [
  {
    title: 'WATCHDOG',
    level: [
      { level: 1, profit: 100, cost: 1000 },
      { level: 2, profit: 200, cost: 5000 },
      { level: 3, profit: 300, cost: 20000 },
      { level: 4, profit: 400, cost: 21000 },
    ],
    totalProfit: 0,
    icon: '/WATCHDOG.png',
    description: 'Watchdog in the doginals drc20 ecosystem to fight against fraudulent projects.'
  },
  {
    title: 'WINANCE PAY',
    level: [
      { level: 1, profit: 100, cost: 1000 },
      { level: 2, profit: 200, cost: 5000 },
      { level: 3, profit: 300, cost: 20000 },
      { level: 4, profit: 400, cost: 100000 },
    ],
    totalProfit: 0,
    icon: '/WINANCE PAY.jpg',
    description: 'Platform crypto purchase and selling platform with fiat by mobile means and virtual money'

  },
  {
    title: 'KTAP COIN',
    level: [
      { level: 1, profit: 240, cost: 2000 },
      { level: 2, profit: 480, cost: 10000 },
      { level: 3, profit: 960, cost: 100000 },
      { level: 4, profit: 1264, cost: 400000 },
    ],
    totalProfit: 0,
    icon: '/KTAP COIN.png',
    description: 'Kabosu Tap ( Ktap ), the doginals drc20 token to receive at the end of the Ktap game.'
  },
  {
    title: 'MY DOGE',
    level: [
      { level: 1, profit: 70, cost: 750 },
      { level: 2, profit: 140, cost: 1400 },
      { level: 3, profit: 280, cost: 6600 },
      { level: 4, profit: 560, cost: 10000 },
    ],
    totalProfit: 0,
    icon: '/my doge.png',
    description: 'Dogecoin\'s first wallet, Will soon support doginals in mobile version and is already organizing giveaways with certain doginal projects.'
  },
  {
    title: 'DOGGY MARKET',
    level: [
      { level: 1, profit: 75, cost: 550 },
      { level: 2, profit: 140, cost: 1000 },
      { level: 3, profit: 200, cost: 4000 },
      { level: 4, profit: 400, cost: 8000 },
    ],
    totalProfit: 0,
    icon: '/dogy maret.png',
    description: 'First doginals market to exchange NFT card and drc20 token to the public'
  },
  {
    title: 'MINI DOGE',
    level: [
      { level: 1, profit: 90, cost: 1000 },
      { level: 2, profit: 180, cost: 4000 },
      { level: 3, profit: 360, cost: 12000 },
      { level: 4, profit: 720, cost: 24000 },
    ],
    totalProfit: 0,
    icon: '/minigode.png',
    description: 'One of the very first NFTs on Dogecoin and working on an adventure game for shibes.'
  },
]


const specialCards = [
  {
    title: 'WE ROBOT',
    profit: 10,
    cost: '500000000',
    icon: '/WE ROBOT.jpeg',
    tagline: 'Withdrawal access',
    description: 'The future of autonomy and artificial intelligence will be realized through the creation of a fleet of autonomous vehicles and robots.',
    class: 'specials1',
  },
  {
    title: 'GRAYSCALE',
    profit: 5,
    cost: '100000000',
    icon: '/GRAYSCALE.jpeg',
    tagline: 'Withdrawal access',
    description: '⚡️LATEST: Grayscale puts $DOGE, Worldcoin on list of 35 potential crypto products',
    class: 'specials2',
  },
  {
    title: 'DOGEFATHER',
    profit: 50,
    cost: '1000000000',
    icon: '/DOGEFATHER.jpeg',
    tagline: 'Get more tokens',
    description: 'Elon Musk is often referred to as the "Doge Father" due to his influential role in popularizing Dogecoin',
    class: 'specials3',
  },
  {
    title: 'SATOSHI NAKAMOTO',
    profit: 5,
    cost: '200000000',
    icon: '/SATOSHI NAKAMOTO.jpeg',
    tagline: 'Swap tokens special',
    description: 'If you don\'t believe it or don\'t understand it, I don\'t have time to try to convince you, sorry.',
    class: 'specials4',
  },
]



// const specialCards = [
//   {
//     title: 'Airdrop Hunter',
//     profit: 10,
//     cost: 0.5,
//     icon: '/hunter.webp',
//     description: 'Withdrawal access',
//     class: 'specials1',
//   },
//   {
//     title: 'Early Access',
//     profit: 5,
//     cost: 0.2,
//     icon: '/access.webp',
//     description: 'Airdrop special',
//     class: 'specials2',
//   },
//   {
//     title: 'Balance Booster',
//     profit: 50,
//     cost: 1,
//     icon: '/booster.webp',
//     description: 'Get more tokens',
//     class: 'specials3',
//   },
//   {
//     title: 'Token Swap Access',
//     profit: 5,
//     cost: 0.2,
//     icon: '/swap.webp',
//     description: 'Swap tokens special',
//     class: 'specials4',
//   },

// ]




// const history = {
//     withdrawals: [],
//     deposits: [],
//     swaps: [],
//   }




export const UserProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [tapBalance, setTapBalance] = useState(0);
  const [level, setLevel] = useState({ id: 1, name: "Bronze", imgUrl: "/bronze.png" });
  const [tapValue, setTapValue] = useState({ level: 1, value: 1 });
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [energy, setEnergy] = useState(0);
  const [battery, setBattery] = useState({ level: 1, energy: 500 });
  const [initialized, setInitialized] = useState(false);
  const [refBonus, setRefBonus] = useState(0);
  const [manualTasks, setManualTasks] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [userManualTasks, setUserManualTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [claimedMilestones, setClaimedMilestones] = useState([]);
  const [claimedReferralRewards, setClaimedReferralRewards] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState({ id: 'selectex', icon: '/exchange.svg', name: 'Select exchange' });
  const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
  const [tapGuru, setTapGuru] = useState(false);
  const [mainTap, setMainTap] = useState(true);
  const [freeGuru, setFreeGuru] = useState(3);
  const [time, setTime] = useState(22);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lastTime, setLastTime] = useState(null);
  const [claimExchangePoint, setClaimExchangePoint] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState({ name: 'd', avatar: '' });
  const [characterMenu, setCharacterMenu] = useState(false)
  const [fullName, setFullName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isAddressSaved, setIsAddressSaved] = useState(false); // State to track if address is saved
  const [coolDownTime, setCoolDownTime] = useState(0);
  const [tappingGuru, setTappingGuru] = useState(0);
  const location = useLocation();
  const [openInfoTwo, setOpenInfoTwo] = useState(true);
  const [openInfoThree, setOpenInfoThree] = useState(true);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [checkInDays, setCheckInDays] = useState([]);
  const [error, setError] = useState(null);
  const [showStartOverModal, setShowStartOverModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [userLevels, setUserLevels] = useState(prTeam.map(() => 0)); // Start at level 0
  const [userLevelsMarket, setUserLevelsMarket] = useState(marketTeam.map(() => 0)); // Start at level 0
  const [totalProfit, setTotalProfit] = useState([0, 0, 0, 0, 0, 0]);
  const [totalMarketProfit, setTotalMarketProfit] = useState([0, 0, 0, 0, 0, 0]);
  const [success, setSuccess] = useState(false);
  const [profitHour, setProfitHour] = useState(0);
  const [purchasedCards, setPurchasedCards] = useState([]);
  const [totalCardsProfits, setTotalCardsProfits] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [youtubeTasks, setYoutubeTasks] = useState([]);
  const [userYoutubeTasks, setUserYoutubeTasks] = useState([]);

  const assets = [
    { symbol: 'KTAP', name: 'KTAP', balance: balance, icon: `${images.tapImage}`, price: 0.0004348 },
    { symbol: 'USDT', name: 'Tether US', balance: 0, icon: '/tether.webp', price: 1 },
    { symbol: 'TON', name: 'Toncoin', balance: 0, icon: '/ton.png', price: 6.68 },
    { symbol: 'NOT', name: 'Notcoin', balance: 0, icon: '/notcoin.jpg', price: 0.01075 },
    { symbol: 'BNB', name: 'BNB', balance: 0, icon: '/bnb2.webp', price: 562.36 },
    { symbol: 'SOL', name: 'Solana', balance: 0, icon: '/solana.png', price: 143.34 }
  ]

  const spinnerLimit = 10;

  const [walletAssets, setWalletAssets] = useState(assets)

  const [spinLimit, setSpinLimit] = useState(spinnerLimit); // New state for spin limit

  useEffect(() => {
    let timerId;
    if (isTimerRunning && time > 0) {
      timerId = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setTapGuru(false);
      setMainTap(true);
    }
    return () => clearInterval(timerId);
  }, [isTimerRunning, time]);

  const startTimer = useCallback(() => {
    setTime(22);
    setTapGuru(true);
    setIsTimerRunning(true);
  }, []);






  const fetchData = async (userId) => {
    if (!userId) return;
    try {
      const userRef = doc(db, 'telegramUsers', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setBalance(userData.balance);
        setTapBalance(userData.tapBalance);
        setTapValue(userData.tapValue);
        setClaimedMilestones(userData.claimedMilestones || []);
        setClaimedReferralRewards(userData.claimedReferralRewards || []);
        setSelectedExchange(userData.selectedExchange);
        setSelectedCharacter(userData.character)
        setLastCheckIn(userData.lastCheckIn?.toDate() || null);
        setCheckInDays(userData.checkInDays || []);
        const data = userDoc.data().history || {};
        setWithdrawals(data.withdrawals || []);
        setDeposits(data.deposits || []);
        setSwaps(data.swaps || []);
        setFreeGuru(userData.freeGuru);
        setProfitHour(userData.profitHour || 0);
        setUserYoutubeTasks(userData.youtubeTasks || []);
        setWalletAddress(userData.address)
        setShowBalance(userData.showBalance)
        setIsAddressSaved(userData.isAddressSaved)
        setWalletAssets(userData.walletAssets || assets)
        setPurchasedCards(userData.specialCards || []);
        setEnergy(userData.energy);
        // Calculate total profits
        const total = purchasedCards.reduce((acc, card) => acc + card.profit, 0);
        setTotalCardsProfits(total);
        setFullName(userData.fullName);
        const span = userDoc.data().spinLimit ?? 10;
        setSpinLimit(span);
        setBattery(userData.battery);
        setLevel(userData.level);
        setId(userData.userId);
        setRefBonus(userData.refBonus || 0);
        setCompletedTasks(userData.tasksCompleted || []);
        setUserManualTasks(userData.manualTasks || []);
        setReferrals(userData.referrals || []);
        await updateActiveTime(userRef)

      }

      const tasksQuerySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = tasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);

      const manualTasksQuerySnapshot = await getDocs(collection(db, 'manualTasks'));
      const manualTasksData = manualTasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setManualTasks(manualTasksData);

      // Fetch youtubeTasks
      const youtubeTasksQuerySnapshot = await getDocs(collection(db, 'youtubeTasks'));
      const youtubeTasksData = youtubeTasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setYoutubeTasks(youtubeTasksData);


      // Fetch settings data
      const settingsDocRef = doc(db, 'settings', '1q01CYx0LFmgLR4wiUxX'); // Replace with your actual document ID
      const settingsDocSnap = await getDoc(settingsDocRef);

      if (settingsDocSnap.exists()) {
        const settingsData = settingsDocSnap.data();
        setCoolDownTime(settingsData.coolDownTime);
        setTappingGuru(settingsData.tappingGuru);
      }

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  const sendUserData = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    let referrerId = queryParams.get("ref");
    if (referrerId) {
      referrerId = referrerId.replace(/\D/g, "");
      handleReferral(referrerId);
    }

    if (telegramUser) {
      const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;
      const finalUsername = username || `${firstName}_${userId}`;
      const fullNamed = `${firstName} ${lastName}`

      try {
        const userRef = doc(db, 'telegramUsers', userId.toString());
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          fetchData(userId.toString());
          await updateEnergy(userRef, userDoc.data().battery.energy);
          await updateReferrals(userRef);
          setInitialized(true);
          return;
        }

        const userData = {
          userId: userId.toString(),
          username: finalUsername,
          firstName: firstName,
          lastName: lastName,
          fullName: fullNamed,
          totalBalance: 0,
          showBalance: true,
          profitHour: 0,
          spinLimit: 10,
          isAddressSaved: false,
          address: '',
          balance: 0,
          tapBalance: 0,
          lastActive: new Date(),
          character: { name: '', avatar: '/user.webp' },
          freeGuru: 3,
          tapValue: { level: 1, value: 1 },
          level: { id: 1, name: "Bronze", imgUrl: "/bronze.png" },
          selectedExchange: { id: 'selectex', icon: '/exchange.svg', name: 'Choose exchange' },
          energy: 500,
          battery: { level: 1, energy: 500 },
          refereeId: referrerId || null,
          referrals: []
        };

        await setDoc(userRef, userData);
        setEnergy(500);
        setFreeGuru(userData.freeGuru);
        setSelectedCharacter(userData.character)
        setFullName(fullNamed)
        setCharacterMenu(true);
        setSelectedExchange({ id: 'selectex', name: 'Choose exchange', icon: '/exchange.svg' });
        setId(userId.toString());

        if (referrerId) {
          const referrerRef = doc(db, 'telegramUsers', referrerId);
          const referrerDoc = await getDoc(referrerRef);
          if (referrerDoc.exists()) {
            await updateDoc(referrerRef, {
              referrals: arrayUnion({
                userId: userId.toString(),
                username: finalUsername,
                balance: 0,
                level: { id: 1, name: "Bronze", imgUrl: "/bronze.png" },
              })
            });
          }
        }
        setInitialized(true);
        fetchData(userId.toString());
      } catch (error) {
        console.error('Error saving user in Firestore:', error);
      }
    }
  };

  const handleReferral = async (referralId) => {
    const userRef = doc(db, 'telegramUsers', referralId);
    const userDoc = await getDoc(userRef);
  
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const hasClaimedReward = userData.claimedReferralRewards || [];
  
      // Vérifiez si l'utilisateur a déjà réclamé la récompense
      if (!hasClaimedReward.includes('Referral Bonus')) {
        // Vérifiez si le nouvel utilisateur a atteint le nombre de parrainages requis
        const referralsCount = userData.referrals.length; // Nombre de parrainages de l'utilisateur
        const reward = friendsRewards.find(reward => referralsCount >= reward.referralsRequired);
  
        // Montant fixe à attribuer à l'utilisateur parrainé
        const fixedBonus = 10000; // Ajustez ce montant selon vos besoins
  
        if (reward) {
          const newBalance = userData.balance + reward.bonusAward; // Montant de la récompense
          try {
            await updateDoc(userRef, {
              balance: newBalance,
              claimedReferralRewards: arrayUnion('Referral Bonus'), // Ajoute la récompense à la liste
            });
            console.log('Récompense de parrainage attribuée avec succès.');
          } catch (error) {
            console.error('Erreur lors de l\'attribution de la récompense de parrainage:', error);
          }
        } else {
          console.log('L\'utilisateur n\'a pas atteint le nombre de parrainages requis pour une récompense.');
        }
  
        // Mise à jour du solde de l'utilisateur parrainé avec le gain fixe
        const newUserBalance = userData.balance + fixedBonus;
        try {
          await updateDoc(userRef, {
            balance: newUserBalance,
          });
          console.log('Gain fixe attribué à l\'utilisateur parrainé avec succès.');
        } catch (error) {
          console.error('Erreur lors de l\'attribution du gain fixe à l\'utilisateur parrainé:', error);
        }
      } else {
        console.log('L\'utilisateur a déjà réclamé cette récompense.');
      }
    } else {
      console.log('Utilisateur non trouvé.');
    }
  };

  const updateEnergy = async (userRef, batteryValue) => {
    const savedEndTime = localStorage.getItem('endTime');
    const savedEnergy = localStorage.getItem('energy');
    const endTime = new Date(savedEndTime);
    const newTimeLeft = endTime - new Date();
    if (newTimeLeft < 0 && savedEnergy <= 0) {
      try {
        await updateDoc(userRef, { energy: batteryValue });
        setEnergy(batteryValue);
      } catch (error) {
        console.error('Error updating energy:', error);
      }
    }
  };

  const updateActiveTime = async (userRef) => {

    try {
      await updateDoc(userRef, {
        lastActive: new Date(),
      });
      console.log('Active Time Updated');
    } catch (error) {
      console.error('Error updating Active Time:', error);
    }
  }

  const updateSpins = async () => {

    if (!telegramUser) {
      console.error('telegramUser is undefined');
      return; // Sortir si telegramUser n'est pas défini
    }

    const { id: userId } = telegramUser;
    const userRef = doc(db, 'telegramUsers', userId.toString());

    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastDate = userData.slotTimeStamp.toDate(); // Convert Firestore timestamp to JS Date
      const formattedDates = lastDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
      const currentDate = new Date(); // Get the current date
      const formattedCurrentDates = currentDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format

      if (formattedDates !== formattedCurrentDates && userData.spinLimit <= 0) {
        await updateDoc(userRef, {
          spinLimit: 10,
          slotTimeStamp: new Date()

        });
        setSpinLimit(10);
      }
    }
  };


  const updateReferrals = async (userRef) => {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const referrals = userData.referrals || [];

    const updatedReferrals = await Promise.all(referrals.map(async (referral) => {
      const referralRef = doc(db, 'telegramUsers', referral.userId);
      const referralDoc = await getDoc(referralRef);
      if (referralDoc.exists()) {
        const referralData = referralDoc.data();
        return {
          ...referral,
          balance: referralData.balance,
          level: referralData.level,
        };
      }
      return referral;
    }));

    await updateDoc(userRef, { referrals: updatedReferrals });

    const totalEarnings = updatedReferrals.reduce((acc, curr) => acc + curr.balance, 0);
    const refBonus = Math.floor(totalEarnings * 0.1);
    const totalBalance = `${balance}` + refBonus;
    try {
      await updateDoc(userRef, { refBonus, totalBalance, lastActive: new Date() });
    } catch (error) {
      console.error('Error updating referrer bonus:', error);
    }
  };

  const updateUserLevel = async (userId, newTapBalance) => {
    let newLevel = { id: 1, name: "Bronze", imgUrl: "/bronze.png" };

    if (newTapBalance >= 1000 && newTapBalance < 1000000) {
      newLevel = { id: 2, name: "Silver", imgUrl: "/silver.png" };
    } else if (newTapBalance >= 1000000 && newTapBalance < 10000000) {
      newLevel = { id: 3, name: "Gold", imgUrl: "/gold.png" };
    } else if (newTapBalance >= 10000000 && newTapBalance < 100000000) {
      newLevel = { id: 4, name: "Platinum", imgUrl: "/platinum.png" };
    } else if (newTapBalance >= 100000000 && newTapBalance < 2500000000) {
      newLevel = { id: 5, name: "Diamond", imgUrl: "/diamond.png" };
    } else if (newTapBalance >= 2500000000) {
      newLevel = { id: 6, name: "Master", imgUrl: "/master.png" };
    }

    if (newLevel.id !== level.id) {
      setLevel(newLevel);
      const userRef = doc(db, 'telegramUsers', userId);
      await updateDoc(userRef, { level: newLevel });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {

      if (!telegramUser) {
        console.error('telegramUser is undefined');
        return; // Sortir si telegramUser n'est pas défini
      }

      const { id: userId } = telegramUser;
      const userRef = doc(db, 'telegramUsers', userId.toString());
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Handle prTeam
        if (userData.prTeam) {
          const updatedLevels = prTeam.map((team) => {
            const teamData = userData.prTeam.find(t => t.title === team.title);
            return teamData ? teamData.level : 0;
          });

          const updatedProfits = prTeam.map((team) => {
            const teamData = userData.prTeam.find(t => t.title === team.title);
            return teamData ? teamData.totalProfit : 0;
          });

          setUserLevels(updatedLevels);
          setTotalProfit(updatedProfits);
        }

        // Handle marketTeam
        if (userData.marketTeam) {
          const updatedLevelsMarket = marketTeam.map((market) => {
            const marketData = userData.marketTeam.find(t => t.title === market.title);
            return marketData ? marketData.level : 0;
          });

          const updatedMarketProfits = marketTeam.map((market) => {
            const marketData = userData.marketTeam.find(t => t.title === market.title);
            return marketData ? marketData.totalMarketProfit : 0;
          });

          setUserLevelsMarket(updatedLevelsMarket);
          setTotalMarketProfit(updatedMarketProfits);
        }
      } else {
        console.error('User document does not exist');
      }
    };

    fetchUserData();
  }, [id, telegramUser]);




  const checkAndUpdateFreeGuru = async () => {
    const userRef = doc(db, 'telegramUsers', id.toString());
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastDate = userData.timeSta.toDate(); // Convert Firestore timestamp to JS Date
      const formattedDates = lastDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
      const currentDate = new Date(); // Get the current date
      const formattedCurrentDates = currentDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format

      if (formattedDates !== formattedCurrentDates && userData.freeGuru <= 0) {
        await updateDoc(userRef, {
          freeGuru: 3,
          timeSta: new Date()

        });
        setFreeGuru(3);
      }
    }
  };


  useEffect(() => {
    const rewards = document.getElementById('reelsActivities');
    const rewardsTwo = document.getElementById('reels2Activities');

    if (location.pathname === '/rewards' || location.pathname === '/checkin') {
      rewards.style.background = "#a4a4a433";
      rewards.style.color = "#fff";
      rewardsTwo.style.color = "#fff";
      rewards.style.height = "60px";
      rewards.style.marginTop = "4px";
      rewards.style.paddingLeft = "6px";
      rewards.style.paddingRight = "6px";
    } else {
      rewards.style.background = "";
      rewards.style.color = "";
      rewards.style.height = "";
      rewards.style.marginTop = "";
      rewardsTwo.style.color = "";
      rewards.style.paddingLeft = "";
      rewards.style.paddingRight = "";
    }
  }, [location.pathname]);


  useEffect(() => {
    // Fetch the remaining clicks from Firestore when the component mounts
    const fetchRemainingClicks = async () => {
      if (id) {
        const userRef = doc(db, 'telegramUsers', id.toString());
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFreeGuru(userData.freeGuru || 0);
        }
      }
    };

    fetchRemainingClicks();
  }, [id]);

  useEffect(() => {
    // Calculate the new balance by adding balance and refBonus
    const newBalance = balance + refBonus;

    // Find the current 'MAX' token in walletAssets
    const maxToken = walletAssets.find(asset => asset.symbol === 'MAX');

    // Check if maxToken exists and if its balance is different from the newBalance
    if (maxToken && maxToken.balance !== newBalance) {
      // Update the balance for the 'MAX' token
      setWalletAssets(prevAssets =>
        prevAssets.map(asset =>
          asset.symbol === 'MAX' ? { ...asset, balance: newBalance } : asset
        )
      );
    }
  }, [balance, refBonus, walletAssets]);


  useEffect(() => {
    const checkLastCheckIn = async () => {
      if (!id) return;

      try {
        const userDocRef = doc(db, 'telegramUsers', id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const now = new Date();

          const lastCheckInDate = userData.lastCheckIn?.toDate();

          if (lastCheckInDate) {
            const lastCheckInMidnight = new Date(lastCheckInDate);
            lastCheckInMidnight.setHours(0, 0, 0, 0);

            const todayMidnight = new Date(now);
            todayMidnight.setHours(0, 0, 0, 0);

            const daysSinceLastCheckIn = Math.floor((todayMidnight - lastCheckInMidnight) / (1000 * 60 * 60 * 24));

            if (daysSinceLastCheckIn === 1) {
              // Last check-in was yesterday, prompt user to claim today's bonus
              setShowClaimModal(true);
            } else if (daysSinceLastCheckIn > 1) {
              // User missed a day, show the start over modal
              setShowStartOverModal(true);
            }
          } else {
            // First time check-in, set the check-in modal to be shown
            setShowClaimModal(true);
          }
        }
      } catch (err) {
        console.error('Error during initial check-in:', err);
        setError('An error occurred while checking your last check-in.');
      }
    };

    checkLastCheckIn();
  }, [id, setCheckInDays, setError]);



  useEffect(() => {
    if (id) {
      checkAndUpdateFreeGuru();
    }
    if (selectedCharacter.name === '') {
      setCharacterMenu(true)
    } else {
      setCharacterMenu(false);
    }
    updateSpins();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    sendUserData();
    // eslint-disable-next-line 
  }, []);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
    // eslint-disable-next-line 
  }, [id]);

  useEffect(() => {
    if (id) {
      updateUserLevel(id, tapBalance);
    }
    // eslint-disable-next-line 
  }, [tapBalance, id]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <UserContext.Provider value={{ balance, specialCards, fullName, youtubeTasks, setYoutubeTasks, userYoutubeTasks, setUserYoutubeTasks, purchasedCards, withdrawals, setWithdrawals, deposits, setDeposits, swaps, setSwaps, walletAssets, setWalletAssets, setPurchasedCards, totalCardsProfits, setTotalCardsProfits, userLevelss, success, setSuccess, userLevels, setUserLevels, totalMarketProfit, setTotalMarketProfit, userLevelsMarket, setUserLevelsMarket, prTeam, marketTeam, totalProfit, setTotalProfit, profitHour, setProfitHour, showStartOverModal, setShowStartOverModal, showClaimModal, setShowClaimModal, spinLimit, setSpinLimit, lastCheckIn, setLastCheckIn, checkInDays, setCheckInDays, error, setError, showBalance, setShowBalance, openInfoTwo, setOpenInfoTwo, openInfoThree, setOpenInfoThree, setFullName, coolDownTime, setCoolDownTime, tappingGuru, setTappingGuru, lastTime, walletAddress, setWalletAddress, isAddressSaved, setIsAddressSaved, selectedCharacter, setSelectedCharacter, characterMenu, setCharacterMenu, setLastTime, claimExchangePoint, setClaimExchangePoint, battery, freeGuru, setFreeGuru, isTimerRunning, setIsTimerRunning, time, setTime, startTimer, setBattery, tapGuru, setTapGuru, mainTap, setMainTap, selectedExchange, setSelectedExchange, tapValue, setTapValue, tapBalance, setTapBalance, level, energy, setEnergy, setBalance, setLevel, loading, setLoading, id, setId, sendUserData, initialized, setInitialized, refBonus, setRefBonus, manualTasks, setManualTasks, userManualTasks, setUserManualTasks, tasks, setTasks, completedTasks, setCompletedTasks, claimedMilestones, setClaimedMilestones, referrals, claimedReferralRewards, setClaimedReferralRewards }}>
      {children}
    </UserContext.Provider>
  );
};