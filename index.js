import express from "express";
import { DateTime } from "luxon";
import Habit from "./models/Habit.js"
import CheckIn from "./models/CheckIn.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Базовый роут для проверки сервера
app.get('/habits', async (req,res)=>{
    try{
        const userId = "usr_972a4b81c3e0"
        //Получение текущего дня пользователя
        const userTimezone = req.headers['x-timezone'] || 'UTC';
        const userLocalTime = DateTime.now().setZone(userTimezone);
        const dayOfWeek = userLocalTime.weekday;
        const todayStr = userLocalTime.toString().split('T')[0]

        
        const habitsData = await Habit.aggregate([  
        {
            $match: {
            userId: userId,
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
                        { $eq: ['$habitId', { $toString: '$$habitId' }] },
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

        return res.json(habitsData)
    }
    catch (error){
        console.log(error)
        return res.status(500).send()
    }
    
})

app.post('/habits', async (req, res)=>{
    try{
        const userId = "usr_972a4b81c3e0"
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
        return res.status(200).send();
    }catch (error){
        console.log(error)
        return res.status(500).send()
    }
})

app.put('/habits/:id', async(req, res) => {
    try{
        const  id  = req.params.id;
        const userId = "usr_972a4b81c3e0"
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


app.delete('/habits/:id', async (req,res)=>{
    try{
        const id  = req.params.id;
        const userId = "usr_972a4b81c3e0"
        
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

app.post('/habits/:id/check-ins', async(req,res)=>{
    try{
        const id  = req.params.id;
        const userId = "usr_972a4b81c3e0"
        const {date, value} = req?.body

        //Проверка чтобы переданная дата не была в будущем относительно текущей дате по часовому поясу пользователя
        const userTimezone = req.headers['x-timezone'] || 'UTC';
        const userDateNow = DateTime.now().setZone(userTimezone);
        const parsedDate = new Date(date);

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
                await checkIn.save();
                return res.json(checkIn)
        }
        else{
            if(habit.type==="helpful" && checkIn.value>=habit.goalValue || habit.type==="harmful" && checkIn.value<=habit.goalValue){
                checkIn.completed=true;
                await checkIn.save();
                return res.json(checkIn)
            };
        }
        await checkIn.save();
        return res.status(200).send();

    }catch(error){
        console.log(error)
        return res.status(500).send()
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
