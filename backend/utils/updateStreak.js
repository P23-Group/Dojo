//Функции для работы с датой и обработки обновления серии пользователя
export const shiftDate = (d, days) => {
    const dt = new Date(d + "T00:00:00Z");
    dt.setUTCDate(dt.getUTCDate() + days);
    return dt.toISOString().slice(0, 10);
};

export function updateStreak(user, today) {
    if (user.lastActiveDate === today) return;
    user.streak = user.lastActiveDate === shiftDate(today, -1) ? user.streak + 1 : 1;
    user.longestStreak = Math.max(user.longestStreak, user.streak);
    user.lastActiveDate = today;
}

export default {shiftDate, updateStreak}