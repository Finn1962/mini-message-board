const messagesContainer = document.getElementById("messages_container");
const messagesInput = document.getElementById("message_input");
const messagesButton = document.getElementById("message_button");

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

messagesContainer.scrollTop =
  messagesContainer.scrollHeight - messagesContainer.clientHeight;

const messages = [];

function handleFetch() {
  if (messagesInput.value === "") return;

  const localDate = new Date();
  fetch("newMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: messagesInput.value,
      user: "Anonimus",
      added: {
        time: localDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        month: months[localDate.getMonth()],
        year: localDate.getFullYear(),
      },
    }),
  })
    .then((res) => res.json())
    .then((data) => updateMessages(data))
    .catch((err) => console.error(err));
}

messagesButton.addEventListener("click", () => {
  handleFetch();
  messagesInput.value = "";
});

messagesInput.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") return;
  await handleFetch();
  messagesInput.value = "";
});

setInterval(() => {
  fetch("messages")
    .then((res) => res.json())
    .then((data) => updateMessages(data))
    .catch((err) => console.error(err));
}, 1000);

function updateMessages(messages) {
  messagesContainer.replaceChildren();

  messages.forEach((message) => {
    createMessageHTML({
      text: message.text,
      user: message.user,
      added: message.added,
    });
  });
}

function createMessageHTML({ text, user, added }) {
  const message = document.createElement("div");
  const meta = document.createElement("div");
  meta.classList.add("message-meta");
  const userElement = document.createElement("p");
  userElement.textContent = user;
  const timeElement = document.createElement("p");
  timeElement.textContent = `${added.time}, ${added.month}, ${added.year}`;
  meta.append(userElement, timeElement);
  const textContainer = document.createElement("div");
  textContainer.classList.add("message-text");
  const textElement = document.createElement("p");
  textElement.textContent = text;
  textContainer.append(textElement);
  message.append(meta, textContainer);
  messagesContainer.append(message);
}
