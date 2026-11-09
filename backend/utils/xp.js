//Функция рассчёта уровня пользователя, 
// передаётся объект пользователя и количество опыта
function calculateXp (user, earnedXp){
    let level = user.lvl;
    let Xp = user.xp + earnedXp;
    let xpNeeded = 100 * (level + 2);
    if(Xp >= xpNeeded){
        level+=1
        user.xp=0,
        user.lvl=level
    }
    else{
        user.xp=Xp
    }
    let stage;
    if (level >= 1 && level <= 2) {
        stage = 1;
    } else if (level >= 3 && level <= 5) {
        stage = 2;
    } else if (level >= 6 && level <= 9) {
        stage = 3;
    } else if (level >= 10 && level <= 14) {
        stage = 4;
    } else {
        stage = 5;
    }

    return {
        level: user.lvl,
        xp: user.xp,
        stage: stage
    };
}

export default calculateXp