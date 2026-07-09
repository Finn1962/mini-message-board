const messagesContainer = document.getElementById("messages_container");
const messagesInput = document.getElementById("message_input");
const messagesButton = document.getElementById("message_button");
const nameInputContainer = document.getElementById("name_input_container");
const nameInput = document.getElementById("name_input");
const nameConfirmButton = document.getElementById("name_confirm_button");
const overlay = document.getElementById("overlay");
const profileLetter = document.getElementById("profile_letter");
const profileName = document.getElementById("profile_name");

const user = {
  name: localStorage.getItem("userName")
    ? localStorage.getItem("userName")
    : null,
  id: localStorage.getItem("userId")
    ? localStorage.getItem("userId")
    : (() => {
        const id = crypto.randomUUID();
        localStorage.setItem("userId", id);
        return id;
      })(),
};

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

let numberOfMessages = 50;

(async () => {
  profileName.textContent = user.name;
  profileLetter.textContent = user.name[0].toUpperCase();
  updateMessages(await getMessages());
  messagesContainer.scrollTop =
    messagesContainer.scrollHeight - messagesContainer.clientHeight;
})();

if (!user.name) {
  nameInputContainer.style.display = "flex";
  overlay.style.display = "block";

  function handleClick() {
    if (nameInput.value === "") return;
    user.name = nameInput.value;
    localStorage.setItem("userName", nameInput.value);
    nameInputContainer.style.display = "none";
    overlay.style.display = "none";
    profileName.textContent = user.name;
    profileLetter.textContent = user.name[0].toUpperCase();
  }

  nameConfirmButton.addEventListener("click", handleClick);

  nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleClick();
  });
}

messagesContainer.addEventListener("scroll", async () => {
  if (messagesContainer.scrollTop === 0) {
    const oldScrollHeight = messagesContainer.scrollHeight;
    const oldScrollTop = messagesContainer.scrollTop;

    numberOfMessages += 50;

    const messages = await getMessages();
    updateMessages(messages);

    const newScrollHeight = messagesContainer.scrollHeight;
    messagesContainer.scrollTop =
      oldScrollTop + (newScrollHeight - oldScrollHeight);
  }
});

async function getMessages() {
  const res = await fetch(`messages?numberOfMessages=${numberOfMessages}`);
  const data = await res.json();
  return data;
}

async function sendNewMessage() {
  if (messagesInput.value === "") return;

  const localDate = new Date();

  const res = await fetch(`newMessage?numberOfMessages=${numberOfMessages}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: messagesInput.value,
      user: user.name,
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
  });

  const data = await res.json();
  return data;
}

messagesButton.addEventListener("click", async () => {
  const messages = await sendNewMessage();
  updateMessages(messages);
  messagesInput.value = "";

  messagesContainer.scrollTop =
    messagesContainer.scrollHeight - messagesContainer.clientHeight;
});

messagesInput.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") return;
  const messages = await sendNewMessage();
  updateMessages(messages);
  messagesInput.value = "";

  messagesContainer.scrollTop =
    messagesContainer.scrollHeight - messagesContainer.clientHeight;
});

setInterval(async () => {
  const messages = await getMessages();
  updateMessages(messages);
}, 3000);

function updateMessages(messages) {
  messagesContainer.replaceChildren();

  messages.forEach((message) => {
    createMessageHTML({
      text: message.text,
      user: message.user,
      userId: message.userId,
      added: message.added,
    });
  });
}

function createMessageHTML({ text, user, userId, added }) {
  const message = document.createElement("div");
  message.classList.add("message");
  if (userId === user.id) message.classList.add("--is-by-user");

  const meta = document.createElement("div");
  meta.classList.add("message-meta");

  const userElement = document.createElement("p");
  userElement.textContent = user;
  userElement.classList.add("user-name");

  const timeElement = document.createElement("p");
  timeElement.textContent = `${added.time}, ${added.month}, ${added.year}`;
  timeElement.classList.add("message-time");

  meta.append(userElement, timeElement);

  const textContainer = document.createElement("div");
  textContainer.classList.add("message-text");

  const textElement = document.createElement("p");
  textElement.textContent = text;

  textContainer.append(textElement);

  message.append(meta, textContainer);

  messagesContainer.append(message);
}
