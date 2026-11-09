import express from "express";
import mongoose from "mongoose";
import { DateTime } from "luxon";

import Habit from "./backend/models/Habit.js";
import CheckIn from "./backend/models/CheckIn.js";
import User from "./backend/Model/user.js";

import calculateXp from "./backend/utils/xp.js";
import {shiftDate, updateStreak} from "./backend/utils/updateStreak.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//authMiddleware придёт из части работы Вадима
app.get('/habits', authMiddleware, async (req,res)=>{
    try{
        const userId = req.user.id
        //Получение текущего дня пользователя
        const userTimezone = req.headers['x-timezone'] || 'UTC';
        const userLocalTime = DateTime.now().setZone(userTimezone);
        const dayOfWeek = userLocalTime.weekday;
        const todayStr = userLocalTime.toString().split('T')[0]

        
        const habitsData = await Habit.aggregate([  
        {
            $match: {
            userId: new mongoose.Types.ObjectId(userId),
            frequency: dayOfWeek        //Ищет объекты привычки по значениям
            }
        },
        
        {
            $lookup: {           
            from: 'checkins', 
            let: {habitId: '$_id'}, //Сохраняет id текущей привычки
            pipeline: [
                {
                $match: {  //Ищет отметку по Id привычки и текущему дню по часовому поясу пользователя
                    $expr: {
                    $and: [
                        { $eq: ['$habitId', '$$habitId'] },
                        { $eq: ['$date', todayStr] }
                    ]
                    }
                }
                }
            ],
            as: 'checkInfo'
            } 
        },

        {
            $unwind: {
            path: '$checkInfo',
            preserveNullAndEmptyArrays: true 
            }
        },
        
        {
            //Добавляет поля value и completed для привычки со значениями пометки, если отметки нет - добавляет значения 0 и false
            $addFields: { 
            todayValue: { $ifNull: ['$checkInfo.value', 0] },
            completed: { $ifNull: ['$checkInfo.completed', false] }
            }
        },
        
        {
            $project: {
            checkInfo: 0
            }
        }
    ]);

        return res.status(200).json(habitsData)
    }
    catch (error){
        console.log(error)
        return res.status(500).send()
    }
    
})

app.post('/habits', authMiddleware, async (req, res)=>{
    try{
        const userId = req.user.id
        const habitData = req.body?.habit //Предположил что данные привычки придут обёрнутые в объекте

        if(!habitData){
            return res.status(400).json({message:"Habit data was not provided"})
        }

        //Валидация данных
        if(habitData.goalValue<0){
            return res.status(400).json({message:"Goal value is less than zero"})
        }
        if(habitData.frequency.length<1||habitData.frequency.length>7){
            return res.status(400).json({message:"Incorrect frequency format"})
        }
        if(!habitData.frequency.every(num => Number.isInteger(num) && num >= 1 && num <= 7)){
            return res.status(400).json({message:"Incorrect frequency format. Days of week have to be specified from 1 to 7"})
        }
        if(habitData.frequency.length !== new Set(habitData.frequency).size){
            return res.status(400).json({message:"Incorrect frequency format. Days of week cannot be repeated"})
        }
        //Создание привычки
        const newHabit= new Habit({
            userId:userId,
            name:habitData.name,
            category:habitData.category,
            type:habitData.type,
            trackingFormat: habitData.trackingFormat,
            goalValue:habitData.goalValue,
            goalUnit:habitData.goalUnit,
            frequency: habitData.frequency
        });
        
        await newHabit.save()
        return res.status(201).send();
    }catch (error){
        console.log(error)
        return res.status(500).send()
    }
})

app.put('/habits/:id', authMiddleware, async(req, res) => {
    try{
        const  id  = req.params.id;
        const userId = req.user.id
        const habitData = req.body?.habit

        if(!habitData){
            return res.status(400).json({message:"Habit data was not provided"})
        }
        //Поиск привычки и обновление их полей, что отправит пользователь в теле
        const habit = await Habit.findOneAndUpdate(
            { _id: id, userId: userId }, 
            { $set: habitData }, 
            { returnDocument: "after", runValidators: true }
        )
        if(!habit){
            return res.status(404).json({message:"Habit not found"})
        }
        return res.status(200).send();
    }catch (error){
        console.log(error)
        return res.status(500).send()
    }
})


app.delete('/habits/:id', authMiddleware, async (req,res)=>{
    try{
        const id  = req.params.id;
        const userId = req.user.id

        const habit = await Habit.findOneAndDelete({_id: id, userId: userId});
        if(!habit){
            return res.status(404).json({message:"Habit not found"})
        }
        return res.status(200).send();
    }
    catch (error){
        console.log(error)
        return res.status(500).send()
    }
})

app.post('/habits/:id/check-ins',authMiddleware, async(req,res)=>{
    try{
        const id  = req.params.id;
        const userId = req.user.id
        const user= await User.findOne({_id: userId});
        const {date, value} = req?.body
        
        //Проверка чтобы переданная дата не была в будущем относительно текущей дате по часовому поясу пользователя
        const userTimezone = req.headers['x-timezone'] || 'UTC';
        const userDateNow = DateTime.now().setZone(userTimezone);
        const parsedDate = new Date(date);

        let xpReward=0;
        if(parsedDate>userDateNow){
            return res.status(400).json({message:"Date cannot be in future"})
        }
        const convertedDate=parsedDate.toISOString().split('T')[0]

        const habit = await Habit.findOne({_id: id, userId: userId});
        if(!habit){
            return res.status(404).json({message:"Habit not found"})
        }
        //Поиск пометки, если нет - создаёт
        let checkIn = await CheckIn.findOne({
            habitId: id, userId: userId, date: convertedDate
        })
        if(!checkIn){
            checkIn = new CheckIn({
                habitId: id,
                userId: userId,
                date: convertedDate,
                value: value,
                completed: false
            })
        }
        else{
            //Проверка если пометка уже выполнена
            if(checkIn.completed){
                return res.status(200).json({message:"This habit already completed for today"})
            }
            checkIn.value+=value;
        }
        //Логика прогресса
        if(habit.trackingFormat==="yes_no"){
                checkIn.completed=true;
                xpReward=10
                updateStreak(user,convertedDate);
        }
        else{
            if(habit.type==="helpful" && checkIn.value>=habit.goalValue || habit.type==="harmful" && checkIn.value<=habit.goalValue){
                checkIn.completed=true;
                xpReward=10
                updateStreak(user,convertedDate);
            };
        }
        const {level, xp, stage} = calculateXp(user, xpReward);
        await checkIn.save();
        await user.save();
        return res.status(200).json({checkIn: checkIn, level: level, xp: xp, stage: stage});

    }catch(error){
        console.log(error)
        return res.status(500).send()
    }
})

app.get('/stats', authMiddleware, async(req,res)=>{
    try{
        const userId = req.user.id
        const user = await User.findOne({_id:userId})
        
        const userTimezone = req.headers['x-timezone'] || 'UTC';
        const userDateNow = DateTime.now().setZone(userTimezone);
        const today = userDateNow.toISODate()
        
        //Проверка последней активности пользователя и сброс если не был активен вчера
        const streakNow = [today, shiftDate(today, -1)].includes(user.lastActiveDate) ? user.streak : 0;
        if(streakNow===0){
            user.streak=0
            await user.save()
        }

        //Создание массива последних 7 дат
        const lastDays = [];
        for (let i = 6; i >= 0; i--) {
            lastDays.push(userDateNow.minus({ days: i }).toISODate());
        }

        

        const startDate = lastDays[0];
        const endDate = lastDays[lastDays.length - 1];

        let helpfulCount=0;
        let harmfulCount=0;

        //Получение списка привычек пользователя
        const habits = await Habit.find({ userId: userId });
        //Подсчёт полезных и вредных привычек
        habits.forEach(habit=>{
            habit.type==="helpful" ? helpfulCount+=1: harmfulCount+=1
        })

        let totalPlanned = 0;

        //Проход по последним 7 дням
        lastDays.forEach(date => {
            //Получение дня недели из даты
            const currentDay = DateTime.fromISO(date, { zone: userTimezone });
            const dayOfWeek = currentDay.weekday;

            habits.forEach(habit => {
                //Проверка активна ли привычка в заданый день недели, добавление к общему количеству запланированых
                if (habit.frequency.includes(dayOfWeek)) {
                    totalPlanned++;
                }
            });
        });

        //Поиск отметок в диапазоне дат
        //Суммирование количество выполненых с групированием по дате
        const activityData = await CheckIn.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: startDate, $lte: endDate },
                completed: true
                }
            },
            {
                $group: {
                _id: "$date", 
                completedCount: { $sum: 1 }
                }
            },
            {
                $project: {
                _id: 0,
                date: "$_id",
                completedCount: 1
                }
            }
        ]);

        //Упрощение массива, подвязывание количество выполненых к дате как индекс
        const dbResultMap = activityData.reduce((acc, curr) => {
            acc[curr.date] = curr.completedCount;
            return acc;
        }, {});

        //Создание финального массива с датой и количеством,
        //берётся дата из массива дат, значение count подбирается
        //из упрощённого массива по дате, если значения нет - добавляет 0
        const result = lastDays.map(date => ({
            date: date,
            completedCount: dbResultMap[date] || 0
        }));

        //Подсчёт сколько всего привычек выполнено, подсчёт процента
        const totalCompleted = result.reduce((sum, item) => sum + item.completedCount, 0);
        const completionPercentage = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

        return res.status(200).json({completionRate: completionPercentage, 
            streak: user.streak,
            helpfulHabits: helpfulCount, 
            harmfulHabits: harmfulCount, 
            activity: result
        })
    }catch(error){
        console.log(error)
        return res.status(500).send()
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
