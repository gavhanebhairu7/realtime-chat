export function formatDate(timestamp) {
  const now = new Date();
  const messageDate = new Date(timestamp);

  const isToday = now.toDateString() === messageDate.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === messageDate.toDateString();

  const time = messageDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return `Today, ${time}`;
  } else if (isYesterday) {
    return `Yesterday, ${time}`;
  } else if (now - messageDate < 7 * 24 * 60 * 60 * 1000) {
    const weekDay = messageDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    return `${weekDay}, ${time}`;
  } else if (now.getFullYear() === messageDate.getFullYear()) {
    const date = messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${date}, ${time}`;
  } else {
    const fullDate = messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${fullDate}, ${time}`;
  }
}
