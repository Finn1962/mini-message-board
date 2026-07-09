const messagesContainer = document.getElementById("messages_container");
const messagesInput = document.getElementById("message_input");
const messagesButton = document.getElementById("message_button");
const nameInputContainer = document.getElementById("name_input_container");
const nameInput = document.getElementById("name_input");
const nameConfirmButton = document.getElementById("name_confirm_button");
const overlay = document.getElementById("overlay");
const profileLetter = document.getElementById("profile_letter");
const profileName = document.getElementById("profile_name");
const loader = document.getElementById("loader");

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

//code that must be executed directly
(async () => {
  if (user.name) {
    profileName.textContent = user.name;
    profileLetter.textContent = user.name[0].toUpperCase();
  }

  try {
    loader.style.display = "grid";
    const res = await fetch(`messages?numberOfMessages=${numberOfMessages}`);
    const data = await res.json();
    updateMessages(data);
    messagesContainer.scrollTop =
      messagesContainer.scrollHeight - messagesContainer.clientHeight;
  } catch (error) {
    console.log(error);
  } finally {
    loader.style.display = "none";
  }
})();

//checks if the username input container is needed
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

//checks if the user has scrolled up and fetches more messages if necessary
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

//fetches all messages from the server
async function getMessages() {
  try {
    const res = await fetch(`messages?numberOfMessages=${numberOfMessages}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

//sends a new message to the server and thereafter returns all messages
async function sendNewMessage() {
  const localDate = new Date();

  try {
    const res = await fetch(`newMessage?numberOfMessages=${numberOfMessages}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: messagesInput.value,
        user: user.name,
        userId: user.id,
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
  } catch (error) {
    console.log(error);
  }
}

//waiting for a click on the send button
messagesButton.addEventListener("click", async () => {
  if (messagesInput.value === "") return;
  const messages = await sendNewMessage();
  updateMessages(messages);
  messagesInput.value = "";

  messagesContainer.scrollTop =
    messagesContainer.scrollHeight - messagesContainer.clientHeight;
});

//Waiting for Enter when entering a message
messagesInput.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") return;
  if (messagesInput.value === "") return;
  const messages = await sendNewMessage();
  updateMessages(messages);
  messagesInput.value = "";

  messagesContainer.scrollTop =
    messagesContainer.scrollHeight - messagesContainer.clientHeight;
});

//fetches all messages every 3 seconds
setInterval(async () => {
  const messages = await getMessages();
  updateMessages(messages);
}, 3000);

//updates all messages in the DOM
function updateMessages(messages) {
  messagesContainer.replaceChildren();
  messages.forEach((message) => {
    createMessageHTML({
      text: message.text,
      userName: message.user,
      userId: message.userId,
      added: message.added,
    });
  });
}

//generates the HTML for a message
function createMessageHTML({ text, userName, userId, added }) {
  const message = document.createElement("div");
  message.classList.add("message");
  if (userId === user.id) message.classList.add("--is-by-user");

  const meta = document.createElement("div");
  meta.classList.add("message-meta");

  const userElement = document.createElement("p");
  userElement.textContent = userName;
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
