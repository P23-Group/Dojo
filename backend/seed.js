import Habit from "./models/Habit.js";
import CheckIn from "./models/CheckIn.js";
import User from "./Model/user.js";
import mongoose from "mongoose";

//Скрипт заполняющий БД данными по умолчанию

//Вызывается через терминал,
//командой node backend/seed.js 
async function defaultSeedDB() {
  try {
    const MONGO_URI=process.env.MONGO_URI

    await mongoose.connect(MONGO_URI);
    console.log('Успешное подключение к MongoDB для заполнения');

    const habitId = new mongoose.Types.ObjectId();
    const habitId1 = new mongoose.Types.ObjectId();
    const habitId2 = new mongoose.Types.ObjectId();

    //Если нужно сбросить БД
/*     await User.deleteMany({})
    await Habit.deleteMany({});
    await CheckIn.deleteMany({}); */
    
    //Пароль qwerty1337
    const user = await User.create({
        name: 'New User', 
        email: 'newuser123@gmail.com', 
        hashPassword: "$2b$10$TVnPe/lLWOQRm9/ZoOsUu.y/73DPVaVffP6ViVZtmt4wOXdksdSuu", 
        xp:0, 
        lvl:1, 
        streak: 0, 
        longestStreak:0, 
        "lastActiveDate": null
    })
    
    const habits=[
        {
            _id: habitId,
            userId:user._id,
            name:"Утренняя зарядка",
            category:"Health",
            type:"helpful",
            trackingFormat:"yes_no",
            goalValue:30,
            goalUnit:"минут",
            frequency:[1,2,3,4,5,6,7]
        },
        {
            userId:user._id,
            name:"Почитать 30 минут",
            category:"Learning",
            type:"helpful",
            trackingFormat:"yes_no",
            goalValue:1,
            goalUnit:"раз",
            frequency:[1,2,3,4,5,6,7]
        },
        {
            _id: habitId1,
            userId:user._id,
            name:"Попить воды",
            category:"Health",
            type:"helpful",
            trackingFormat:"counter",
            goalValue:4,
            goalUnit:"стаканов",
            frequency:[1,2,3,4,5,6,7]
        },
        {
            userId:user._id,
            name:"Спланировать завтрашний день",
            category:"Productivity",
            type:"helpful",
            trackingFormat:"yes_no",
            goalValue:1,
            goalUnit:"раз",
            frequency:[1,2,3,4,5,6,7]
        },
        {
            userId:user._id,
            name:"Не курить",
            category:"Avoid",
            type:"harmful",
            trackingFormat:"yes_no",
            goalValue:0,
            goalUnit:"сигарет",
            frequency:[1,2,3,4,5,6,7]
        },
        {
            _id: habitId2,
            userId:user._id,
            name:"Избегать сладких напитков",
            category:"Avoid",
            type:"harmful",
            trackingFormat:"counter",
            goalValue:3,
            goalUnit:"напитков",
            frequency:[1,2,3,4,5,6,7]
        },
    ]

    const checkIns=[
        {
            habitId:habitId,
            userId: user._id,
            date: "2026-11-07",
            value: 1,
            completed:true
        },
        {
            habitId:habitId2,
            userId: user._id,
            date: "2026-11-08",
            value: 1,
            completed:true
        },
        {
            habitId:habitId1,
            userId: user._id,
            date: "2026-11-08",
            value: 0,
            completed:true
        },
        {
            habitId:habitId1,
            userId: user._id,
            date: "2026-11-07",
            value: 0,
            completed:true
        },
    ]

    await Habit.insertMany(habits);
    await CheckIn.insertMany(checkIns);
    console.log('База данных заполнена');

  } catch (error) {
    console.error('Ошибка при заполнении БД:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Подключение к MongoDB закрыто.');
  }
}

defaultSeedDB()