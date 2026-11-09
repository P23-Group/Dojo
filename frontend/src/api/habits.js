const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(
  /\/$/,
  "",
);

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Could not connect to the habits API. Check that the backend is running.",
    );
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.message ?? `Request failed (${response.status}).`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function getHabits() {
  const result = await request("/habits");
  return Array.isArray(result) ? result : result.habits;
}

export async function createHabit(habit) {
  const result = await request("/habits", {
    method: "POST",
    body: JSON.stringify(habit),
  });
  return result.habit ?? result;
}

export async function checkIn(habitId, checkin) {
  const result = await request(
    `/habits/${encodeURIComponent(habitId)}/check-ins`,
    {
      method: "POST",
      body: JSON.stringify(checkin),
    },
  );
  return result?.checkIn ?? result;
}
